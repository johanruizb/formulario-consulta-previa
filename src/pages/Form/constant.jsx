import { useWatch } from "react-hook-form";
import { URI } from "../../components/constant";
import AsyncSelect from "../../components/Fields/AsyncSelect";
import BirthdayField from "../../components/Fields/BirthdayField";
import CheckboxField from "../../components/Fields/ChecboxField";
import CustomAsyncSelect from "../../components/Fields/CustomAsyncSelect";
import HighlightedSelect from "../../components/Fields/HighlightedSelect";
import PhoneNumber from "../../components/Fields/PhoneNumber";
import BasicSelect from "../../components/Fields/Select";
import BasicTextField from "../../components/Fields/TextField";
import TurnstileField from "../../components/Fields/TurnstileField";
import DocumentImage from "../../components/Form/DocumentImage";
import OtroCampo from "../../components/Form/OtroCampo";
import { replaceAllSpaces, toUpperCase } from "./functions";
import isProduction from "../../utils/isProduction";

// Campos editables cuando el usuario está registrado
const EDITABLE_FIELDS_WHEN_REGISTERED = [
    "otherGender",
    "ethnicity",
    "typeEntity",
    "entityName",
    "phoneNumber",
    "email",
    "stateLocation",
    "cityLocation",
    "neighborhood",
    "zona",
    "connectivity",
    "otra_conectividad",
    "processingOfPersonalData",
    "cursos_inscritos",
];

function useFieldForm(methods, isEditing = false) {
    const { control } = methods;
    const cursos_inscritos = useWatch({
        control,
        name: "cursos_inscritos",
    });

    const allFields = [
        {
            Component: HighlightedSelect,
            controller: {
                name: "cursos_inscritos",
                defaultValue: "",
                rules: {
                    required: {
                        value: true,
                        message: "Este campo no puede estar vacio",
                    },
                },
            },
            field: {
                options: [
                    {
                        value: 5,
                        label: "Funcionarios",
                    },
                    {
                        value: 6,
                        label: "Comunidades",
                    },
                ],
                label: "¿A qué diplomado quieres inscribirte?",
                required: true,
            },
            size: 12,
        },

        ...([5, 6].includes(cursos_inscritos)
            ? [
                  {
                      Component: BasicTextField,
                      controller: {
                          name: "firstName",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                              pattern: {
                                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                  message: "Por favor verifica el nombre",
                              },
                              maxLength: {
                                  value: 150,
                                  message:
                                      "El nombre no puede tener más de 150 caracteres",
                              },
                          },
                      },
                      field: {
                          label: "Nombres",
                          required: true,
                          onChange: toUpperCase,
                          disabled:
                              isEditing &&
                              !EDITABLE_FIELDS_WHEN_REGISTERED.includes(
                                  "firstName",
                              ),
                      },
                  },
                  {
                      Component: BasicTextField,
                      controller: {
                          name: "lastName",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                              pattern: {
                                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                  message: "Por favor verifica el apellido",
                              },
                              maxLength: {
                                  value: 150,
                                  message:
                                      "El apellido no puede tener más de 150 caracteres",
                              },
                          },
                      },
                      field: {
                          label: "Apellidos",
                          required: true,
                          onChange: toUpperCase,
                      },
                  },
                  {
                      Component: BasicSelect,
                      controller: {
                          name: "identityDocument",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          options: [
                              {
                                  value: 1,
                                  label: "(CC) Cédula de ciudadanía",
                              },
                              {
                                  value: 2,
                                  label: "(CE) Cédula de extranjería",
                              },
                              {
                                  value: 3,
                                  label: "(PA) Pasaporte",
                              },
                              {
                                  value: 4,
                                  label: "(PR) Permiso de residencia",
                              },
                              {
                                  value: 5,
                                  label: "(TI) Tarjeta de identidad",
                              },
                          ],
                          label: "Tipo de documento de identidad",
                          required: true,
                      },
                  },
                  {
                      Component: BasicTextField,
                      controller: {
                          name: "documentNumber",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                              maxLength: {
                                  value: 20,
                                  message:
                                      "El número de documento no puede tener más de 20 caracteres",
                              },
                              pattern: {
                                  value: /^[^.,\s]+$/,
                                  message:
                                      "El número de documento no puede tener espacios, puntos o comas",
                              },
                          },
                      },
                      field: {
                          label: "Número de documento",
                          required: true,
                          onBlur: replaceAllSpaces,
                      },
                  },
                  {
                      Component: AsyncSelect,
                      controller: {
                          name: "countryExpedition",
                          defaultValue: "CO",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          label: "País de expedición",
                          required: true,
                      },
                      fetch: {
                          url: `${URI.FORM}/v1/countries`,
                      },
                  },
                  {
                      Component: DocumentImage,
                      size: 12,
                  },
                  {
                      Component: BirthdayField,
                      controller: {
                          name: "birthdate",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          label: "Fecha de nacimiento",
                          required: true,
                      },
                  },
                  {
                      Component: AsyncSelect,
                      controller: {
                          name: "countryBirth",
                          defaultValue: "CO",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          label: "País de nacimiento",
                          required: true,
                      },
                      fetch: {
                          url: `${URI.FORM}/v1/countries`,
                      },
                  },
                  {
                      Component: CustomAsyncSelect,
                      controller: {
                          name: "stateBirth",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                          dependencies: ["countryBirth"],
                      },
                      field: {
                          label: "Departamento de nacimiento",
                          required: true,
                      },
                      fetch: {
                          url: `${URI.FORM}/v1/countries/$1/states`,
                      },
                  },
                  {
                      Component: CustomAsyncSelect,
                      controller: {
                          name: "cityBirth",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                          dependencies: ["countryBirth", "stateBirth"],
                      },
                      field: {
                          label: "Ciudad de nacimiento",
                          required: true,
                      },
                      fetch: {
                          url: `${URI.FORM}/v1/countries/$1/states/$2/cities`,
                      },
                  },
                  {
                      Component: BasicSelect,
                      controller: {
                          name: "gender",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          options: [
                              {
                                  value: 1,
                                  label: "Femenino",
                              },
                              {
                                  value: 2,
                                  label: "Masculino",
                              },
                              {
                                  value: 3,
                                  label: "Transgénero",
                              },
                              {
                                  value: 4,
                                  label: "No binario",
                              },
                              {
                                  value: 5,
                                  label: "Prefiero no decirlo",
                              },
                              {
                                  value: 0,
                                  label: "Otro (especifique)",
                              },
                          ],
                          label: "Género",
                          required: true,
                      },
                  },
                  {
                      Component: OtroCampo,
                      OtherComponent: BasicTextField,
                      controller: {
                          name: "otherGender",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                          dependencies: "gender",
                          otherKey: 0,
                      },
                      field: {
                          label: "Otro género (especificar)",
                          required: true,
                          onChange: toUpperCase,
                      },
                      gridless: true,
                  },
                  {
                      Component: BasicSelect,
                      controller: {
                          name: "ethnicity",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          options: [
                              {
                                  value: 1,
                                  label: "Indígena",
                              },
                              {
                                  value: 2,
                                  label: "Mestizo",
                              },
                              {
                                  value: 3,
                                  label: "Blanco",
                              },
                              {
                                  value: 4,
                                  label: "Rom",
                              },
                              {
                                  value: 5,
                                  label: "Raizal del Archipiélago de San Andrés y Providencia",
                              },
                              {
                                  value: 6,
                                  label: "Palenquero de San Basilio",
                              },
                              {
                                  value: 7,
                                  label: "Negro(a), afrocolombiano(a) o afrodescendiente",
                              },
                              {
                                  value: 8,
                                  label: "Mulato(a)",
                              },
                              {
                                  value: 9,
                                  label: "Ninguno de los anteriores",
                              },
                          ],
                          label: "Grupo poblacional",
                          required: true,
                      },
                  },
                  {
                      Component: BasicSelect,
                      controller: {
                          name: "typeEntity",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          options: cursos_inscritos
                              ? cursos_inscritos == 6
                                  ? [
                                        {
                                            value: 1,
                                            label: "Comunidad Negro(a) afrocolombiano(a) o afrodescendiente",
                                        },
                                        {
                                            value: 2,
                                            label: "Comunidad Indígena",
                                        },
                                        {
                                            value: 3,
                                            label: "Ejecutores de procesos Consulta Previa",
                                        },
                                        {
                                            value: 4,
                                            label: "Institucionalidad interviniente en Consulta Previa",
                                        },
                                        {
                                            value: 7,
                                            label: "Población civil",
                                        },
                                        {
                                            value: 8,
                                            label: "Empresario",
                                        },
                                        {
                                            value: 9,
                                            label: "Educación",
                                        },
                                    ]
                                  : [
                                        {
                                            value: 15,
                                            label: "Funcionarios/contratistas del Ministerio del Interior",
                                        },
                                        {
                                            value: 16,
                                            label: "Funcionarios/contratistas de otra entidad pública",
                                        },
                                    ]
                              : [],
                          label: "De los siguientes roles en cuál se reconoce?",
                          required: true,
                      },
                  },
                  {
                      Component: BasicTextField,
                      controller: {
                          name: "entityName",
                          defaultValue: "",
                          rules: {
                              maxLength: {
                                  value: 300,
                                  message:
                                      "El nombre no puede tener más de 300 caracteres",
                              },
                              minLength: {
                                  value: 3,
                                  message:
                                      "El nombre no puede tener menos de 3 caracteres",
                              },
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          label: "Nombre de la entidad u organización que representa",
                          required: true,
                          onChange: toUpperCase,
                      },
                  },
                  {
                      Component: PhoneNumber,
                      controller: {
                          name: "phoneNumber",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          label: "Número de teléfono - WhatsApp",
                          required: true,
                      },
                  },
                  {
                      Component: BasicTextField,
                      controller: {
                          name: "email",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                              pattern: {
                                  value: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                                  message: "Por favor verifica el correo",
                              },
                              maxLength: {
                                  value: 300,
                                  message:
                                      "El correo no puede tener más de 300 caracteres",
                              },
                          },
                      },
                      field: {
                          label: "Correo electrónico",
                          required: true,
                          onBlur: replaceAllSpaces,
                      },
                  },
                  {
                      Component: AsyncSelect,
                      controller: {
                          name: "stateLocation",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          label: "Departamento de residencia",
                          required: true,
                      },
                      fetch: {
                          url: `${URI.FORM}/v1/countries/CO/states`,
                      },
                  },
                  {
                      Component: CustomAsyncSelect,
                      controller: {
                          name: "cityLocation",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                          dependencies: ["stateLocation"],
                      },
                      field: {
                          label: "Ciudad de residencia",
                          required: true,
                      },
                      fetch: {
                          url: `${URI.FORM}/v1/countries/CO/states/$1/cities`,
                      },
                  },
                  {
                      Component: BasicTextField,
                      controller: {
                          name: "neighborhood",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                              maxLength: {
                                  value: 300,
                                  message:
                                      "El barrio no puede tener más de 300 caracteres",
                              },
                          },
                      },
                      field: {
                          label: "Barrio de residencia",
                          required: true,
                      },
                  },
                  {
                      Component: BasicSelect,
                      controller: {
                          name: "zona",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          options: [
                              {
                                  value: "rural",
                                  label: "Rural",
                              },
                              {
                                  value: "urbana",
                                  label: "Urbana",
                              },
                          ],
                          label: "Zona de residencia",
                          required: true,
                      },
                  },
                  {
                      Component: BasicSelect,
                      controller: {
                          name: "connectivity",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                          },
                      },
                      field: {
                          options: [
                              {
                                  value: "nula",
                                  label: "Sin conexión",
                              },
                              {
                                  value: "baja",
                                  label: "Solo con wifi público",
                              },
                              {
                                  value: "media",
                                  label: "Por intervalos de tiempo con dificultad",
                              },
                              {
                                  value: "plena",
                                  label: "Todo el día sin dificultad",
                              },
                              {
                                  value: "otra",
                                  label: "Otra (especificar)",
                              },
                          ],
                          label: "Acceso a conexión de internet",
                          required: true,
                      },
                  },
                  {
                      Component: OtroCampo,
                      OtherComponent: BasicTextField,
                      controller: {
                          name: "otra_conectividad",
                          defaultValue: "",
                          rules: {
                              required: {
                                  value: true,
                                  message: "Este campo no puede estar vacio",
                              },
                              maxLength: {
                                  value: 100,
                                  message:
                                      "Este campo no puede tener más de 100 caracteres",
                              },
                          },
                          dependencies: "connectivity",
                          otherKey: "otra",
                      },
                      field: {
                          label: "Otra conectividad (especificar)",
                          required: true,
                          onChange: toUpperCase,
                      },
                      gridless: true,
                  },
                  {
                      Component: CheckboxField,
                      controller: {
                          name: "processingOfPersonalData",
                          defaultValue: false,
                          rules: {
                              required: {
                                  value: true,
                                  message:
                                      "Es necesario marcar la casilla para continuar",
                              },
                          },
                      },
                      size: 12,
                      gridless: true,
                  },
              ]
            : []),

        {
            Component: TurnstileField,
            siteKey: isProduction
                ? "0x4AAAAAAB2McbF4i64uJyTJ"
                : "1x00000000000000000000AA",
            gridless: true,
        },
    ];

    // Filtrar DocumentImage si está en modo edición
    let fields = isEditing
        ? allFields.filter((field) => field.Component !== DocumentImage)
        : allFields;

    // Aplicar disabled a los campos que no son editables cuando está en modo edición
    if (isEditing) {
        fields = fields.map((field) => {
            const fieldName = field.controller?.name;
            if (
                fieldName &&
                !EDITABLE_FIELDS_WHEN_REGISTERED.includes(fieldName)
            ) {
                return {
                    ...field,
                    field: {
                        ...field.field,
                        disabled: true,
                    },
                };
            }
            return field;
        });
    }

    return { fields };
}

export default useFieldForm;
