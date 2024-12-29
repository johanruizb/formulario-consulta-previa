import SearchFieldDoc from '../../components/Fields/SearchFieldDoc'

export default {
    'diplomado': [
        {
            Component: SearchFieldDoc,
            controller: {
                name: "birthdate",
                defaultValue: ""
            },
            field: {
                label: "Buscar Documento",
                text: "Por favor, ingresa tu cédula para validar si ya te has inscrito previamente",
                required: true,
            },
        },
    ]
}