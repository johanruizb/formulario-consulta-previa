import dayjs from "dayjs";
import INSCRIPCION from "../../hooks/request/inscripcion";
import { formDataFromObject } from "../../utils/form";
import getTimeout from "../../utils/timeout";

// CONST
const COURSE_AVALAIBLES = ["diplomado"];

export function validateFormData(form) {
    if (form === undefined) return false;
    let response = false;
    const keys = [
        "birthdate",
        "cityBirth",
        "cityLocation",
        "connectivity",
        "documentNumber",
        "email",
        "entityName",
        "ethnicity",
        "firstName",
        "frontDocument",
        "gender",
        "identityDocument",
        "lastName",
        "neighborhood",
        "phoneNumber",
        "stateBirth",
        "stateLocation",
        "typeEntity",
        "zona",
    ];
    keys.forEach((item) => {
        if (
            form[item] !== "" &&
            form[item] !== null &&
            form[item] !== undefined
        )
            response = true;
    });
    return response;
}

export function registerUsuer(form, curso, onOpenAlert) {
    try {
        // convert object
        const dataUser = convertObjetToFormatterCorrect(form);
        const formData = formDataFromObject({ ...dataUser, curso });
        const start = dayjs();

        INSCRIPCION.registrar(formData)
            .then((response) => {
                setTimeout(async () => {
                    if (response.ok) {
                        const res = await response.json();
                        onOpenAlert(
                            res.message ??
                                "Sus datos han sido registrados. El equipo del proyecto se pondrá en contacto con usted en los próximos días para brindarle más información",
                        );
                    } else {
                        response
                            ?.json()
                            .then((data) => {
                                onOpenAlert(
                                    data.message ??
                                        `Algo ha fallado al registrarse (${
                                            response.status
                                        }_${response.statusText.toUpperCase()})`,
                                    true,
                                );
                            })
                            .catch(() => {
                                onOpenAlert(
                                    "No se ha obtenido respuesta del servidor",
                                    true,
                                );
                            });
                    }
                }, getTimeout(start));
            })
            .catch(() => {
                console.log("Ha ocurrido un error");
            });
    } catch (e) {
        console.log(e);
    }
}

export function convertObjetToFormatterCorrect(obj) {
    let response = {};
    try {
        Object.keys(transformObjt).map((name) => {
            response[transformObjt[name]] = obj[name];
        });
    } catch (e) {
        console.log(e);
    }

    return response;
}

export function initShow(curso, form) {
    return COURSE_AVALAIBLES.includes(curso) && !validateFormData(form);
}

const transformObjt = {
    entidad: "entityName",
    pais_nac: "countryBirth",
    estado_nac: "stateBirth",
    estado_res: "countryExpedition",
    nombres: "firstName",
    apellidos: "lastName",
    num_doc: "documentNumber",
    foto_doc1: "frontDocument",
    foto_doc2: "backDocument",
    fecha_nac: "birthdate",
    genero_otro: "otherGender",
    telefono1: "phoneNumber",
    correo_electronico: "email",
    barrio: "neighborhood",
    zona: "zona",
    conectividad: "connectivity",
    otra_conectividad: "otra_conectividad",
    continuar_curso_120: "continuar_curso_120",
    tipo_doc: "identityDocument",
    pais_exp: "countryExpedition",
    ciudad_nac: "cityBirth",
    genero: "gender",
    etnia: "ethnicity",
    tipo_cliente: "typeEntity",
    ciudad: "cityLocation",
};
