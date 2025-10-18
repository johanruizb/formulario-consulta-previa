import { expect, test, type Page, type Route } from "@playwright/test";
import { Buffer } from "node:buffer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonHeaders = {
    "content-type": "application/json",
} as const;

const countries = [
    { id: 48, iso2: "CO", name: "Colombia" },
    { id: 32, iso2: "AR", name: "Argentina" },
];

const statesByCountry: Record<string, { id: number; name: string }[]> = {
    CO: [
        { id: 5, name: "Antioquia" },
        { id: 11, name: "Bogotá D.C." },
    ],
    AR: [{ id: 1, name: "Buenos Aires" }],
};

const citiesByState: Record<string, { id: number; name: string }[]> = {
    "5": [
        { id: 5001, name: "Medellín" },
        { id: 5002, name: "Itagüí" },
    ],
    "11": [{ id: 11001, name: "Bogotá" }],
    "1": [{ id: 1001, name: "Buenos Aires" }],
};

const frontDocumentPath = path.resolve(
    __dirname,
    "../../src/assets/frente.png",
);
const backDocumentPath = path.resolve(
    __dirname,
    "../../src/assets/reverso.png",
);

const DOCUMENT_NUMBER = "1234567890";

async function fulfillJson(route: Route, payload: unknown, status = 200) {
    await route.fulfill({
        status,
        headers: jsonHeaders,
        body: JSON.stringify(payload),
    });
}

test.beforeEach(async ({ page }: { page: Page }) => {
    await page.route("**/api/v1/inscripcion/estado", (route: Route) =>
        fulfillJson(route, { activo: true }),
    );

    await page.route("**/api/v1/inscripcion/cupos/**", (route: Route) =>
        fulfillJson(route, { curso_disponible: true, cupos: 25 }),
    );

    await page.route("**/api/ubicacion/countries", (route: Route) =>
        fulfillJson(route, countries),
    );

    await page.route(
        "**/api/ubicacion/countries/*/states/*/cities",
        async (route: Route) => {
            const url = new URL(route.request().url());
            const parts = url.pathname.split("/");
            const stateId = parts.at(-2);
            const payload =
                stateId && stateId !== "undefined"
                    ? (citiesByState[stateId] ?? [])
                    : [];
            await fulfillJson(route, payload);
        },
    );

    await page.route(
        "**/api/ubicacion/countries/*/states",
        async (route: Route) => {
            const url = new URL(route.request().url());
            if (url.pathname.includes("/cities/")) {
                return;
            }
            const parts = url.pathname.split("/");
            const countryCode = parts.at(-2);
            const payload =
                countryCode && countryCode !== "undefined"
                    ? statesByCountry[countryCode]
                    : [];
            await fulfillJson(route, payload ?? []);
        },
    );

    await page.route(
        "https://challenges.cloudflare.com/**",
        async (route: Route) => {
            const target = route.request().url();
            if (target.includes("/turnstile/v0/api.js")) {
                await route.fulfill({
                    status: 200,
                    contentType: "application/javascript",
                    body: [
                        "window.turnstile = window.turnstile || {};",
                        "window.turnstile.render = function (container, options) {",
                        "  if (options && typeof options.callback === 'function') {",
                        "    options.callback('test-turnstile-token');",
                        "  }",
                        "  return 'playwright-turnstile';",
                        "};",
                        "window.turnstile.remove = () => {};",
                        "window.turnstile.reset = () => {};",
                        "window.turnstile.execute = (_, opts) => {",
                        "  if (opts && typeof opts.callback === 'function') {",
                        "    opts.callback('test-turnstile-token');",
                        "  }",
                        "};",
                    ].join("\n"),
                });
            } else {
                await route.fulfill({ status: 204, body: "" });
            }
        },
    );

    await page.route(
        "**/api/usuarios/search/inscritos",
        async (route: Route) => {
            await fulfillJson(route, { message: "No encontrado" }, 404);
        },
    );
});

async function selectHelper(
    fieldName: string,
    optionLabel: string,
    page: Page,
) {
    await page.locator(`#mui-component-select-${fieldName}`).click();
    await page.getByRole("option", { name: optionLabel }).click();
}

test("permite completar y enviar el formulario de inscripción", async ({
    page,
}: {
    page: Page;
}) => {
    let submittedBody: Buffer | undefined;
    let submittedHeaders: Record<string, string> | undefined;

    await page.route(
        "**/api/v1/inscripcion/registrar",
        async (route: Route) => {
            submittedBody = await route.request().postDataBuffer();
            submittedHeaders = route.request().headers();
            await fulfillJson(route, { message: "Registro exitoso" });
        },
    );

    await page.goto("/");

    await page
        .getByRole("textbox", { name: "Número de documento" })
        .fill(DOCUMENT_NUMBER);
    await page.getByRole("button", { name: "Continuar inscripción" }).click();

    await expect(
        page.locator("#mui-component-select-cursos_inscritos"),
    ).toBeVisible();

    await selectHelper("cursos_inscritos", "Comunidades", page);

    await page.getByLabel("Nombres").fill("Juan");
    await page.getByLabel("Apellidos").fill("Perez");

    await selectHelper("identityDocument", "(CC) Cédula de ciudadanía", page);

    await page.getByLabel("Número de documento").fill(DOCUMENT_NUMBER);

    await selectHelper("countryExpedition", "Colombia", page);

    const fileInputs = page.locator('input[type="file"]');
    await fileInputs.nth(0).setInputFiles(frontDocumentPath);
    await fileInputs.nth(1).setInputFiles(backDocumentPath);
    await expect(page.getByLabel("Frente del documento")).toHaveValue(
        "frente.png",
    );
    await expect(page.getByLabel("Reverso del documento")).toHaveValue(
        "reverso.png",
    );

    await page.getByLabel("Fecha de nacimiento").fill("10/05/2000");
    await page.keyboard.press("Enter");

    await selectHelper("countryBirth", "Colombia", page);
    await selectHelper("stateBirth", "Antioquia", page);
    await selectHelper("cityBirth", "Medellín", page);

    await selectHelper("gender", "Femenino", page);
    await selectHelper("ethnicity", "Mestizo", page);
    await selectHelper("typeEntity", "Comunidad Indígena", page);

    await page
        .getByLabel("Nombre de la entidad u organización que representa")
        .fill("Cabildo Mayor");

    await page.getByLabel("Número de teléfono - WhatsApp").fill("3201234567");

    await page.getByLabel("Correo electrónico").fill("test@example.com");

    await selectHelper("stateLocation", "Antioquia", page);
    await selectHelper("cityLocation", "Medellín", page);

    await page.getByLabel("Barrio de residencia").fill("Centro");
    await selectHelper("zona", "Rural", page);
    await selectHelper("connectivity", "Plena", page);
    await selectHelper("nivel_educativo", "Profesional universitario", page);

    await page
        .getByRole("checkbox", { name: /Acepto la/i })
        .check({ force: true });

    await expect(
        page.getByRole("button", { name: "Registrarse" }),
    ).toBeEnabled();
    await page.getByRole("button", { name: "Registrarse" }).click();

    await expect(page.getByText("Registro exitoso")).toBeVisible();
    await page.getByRole("button", { name: "Listo" }).click();

    expect(submittedBody).toBeDefined();
    expect(submittedHeaders?.["content-type"]).toContain("multipart/form-data");

    const bodyText = submittedBody?.toString("utf-8") ?? "";

    expect(bodyText).toContain('name="frontDocument"');
    expect(bodyText).toContain('filename="frente.png"');
    expect(bodyText).toContain('name="backDocument"');
    expect(bodyText).toContain('filename="reverso.png"');
    expect(bodyText).toContain('name="cf-turnstile-token"');
    expect(bodyText).toContain("test-turnstile-token");
    expect(bodyText).toContain('name="firstName"');
    expect(bodyText).toContain("JUAN");
    expect(bodyText).toContain('name="lastName"');
    expect(bodyText).toContain("PEREZ");
    expect(bodyText).toContain('name="cursos_inscritos"');
    expect(bodyText).toContain('name="processingOfPersonalData"');
});
