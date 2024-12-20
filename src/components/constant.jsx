import isProduction from "../utils/isProduction";

const COLOMBIA = {
    id: 48,
    name: "Colombia",
    iso3: "COL",
    numeric_code: "170",
    iso2: "CO",
    phonecode: "57",
    capital: "Bogotá",
    currency: "COP",
    currency_name: "Colombian peso",
    currency_symbol: "$",
    tld: ".co",
    native: "Colombia",
    region: "Americas",
    region_id: 2,
    subregion: "South America",
    subregion_id: 8,
    nationality: "Colombian",
    timezones: [
        {
            zoneName: "America/Bogota",
            gmtOffset: -18000,
            gmtOffsetName: "UTC-05:00",
            abbreviation: "COT",
            tzName: "Colombia Time",
        },
    ],
    translations: {
        kr: "콜롬비아",
        "pt-BR": "Colômbia",
        pt: "Colômbia",
        nl: "Colombia",
        hr: "Kolumbija",
        fa: "کلمبیا",
        de: "Kolumbien",
        es: "Colombia",
        fr: "Colombie",
        ja: "コロンビア",
        it: "Colombia",
        cn: "哥伦比亚",
        tr: "Kolombiya",
    },
    latitude: "4.00000000",
    longitude: "-72.00000000",
    emoji: "🇨🇴",
    emojiU: "U+1F1E8 U+1F1F4",
};

const URI = {
    FORM: isProduction ? "" : `http://${window.location.hostname}:3000`,
    API: isProduction
        ? "https://panel.consultaprevia.co/api/v1"
        : `http://${window.location.hostname}:8080/api/v1`,
    SERVER: isProduction
        ? "https://panel.consultaprevia.co"
        : `http://${window.location.hostname}:8080`,
};

const FORM_FIELDS_LABELS = {
    firstName: "Nombres",
    lastName: "Apellidos",
    identityDocument: "Tipo de documento",
    documentNumber: "Número de documento",
    countryExpedition: "País de expedición",
    frontDocument: "Frente del documento",
    backDocument: "Reverso del documento",
    birthdate: "Fecha de nacimiento",
    cityBirth: "Ciudad de nacimiento",
    gender: "Género",
    gender_other: "Otro (especifique)",
    ethnicity: "Etnia",
    entityName: "Nombre de la entidad u organización que representa",
    typeEntity: "De los siguientes roles en cual se reconoce?",
    phoneNumber: "Número de teléfono",
    whatsappNumber: "Número de WhatsApp",
    email: "Correo electrónico",
    cityLocation: "Ciudad de residencia",
    address: "Dirección de residencia",
    neighborhood: "Barrio de residencia",
    stratum: "Estrato",
    connectivity: "Conectividad",
    countryBirth: "País de nacimiento",
    stateBirth: "Departamento de nacimiento",
    stateLocation: "Departamento de residencia",
    processingOfPersonalData:
        "Autorización para el tratamiento de datos personales",
};

// eslint-disable-next-line react-refresh/only-export-components
export { COLOMBIA, URI, FORM_FIELDS_LABELS };
