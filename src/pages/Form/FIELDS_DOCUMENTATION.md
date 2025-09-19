# Documentación Técnica de Campos - Sistema de Consulta Previa

## Descripción General

Este documento describe técnicamente todos los campos disponibles en el sistema de registro para los cursos de Consulta Previa. La información está estructurada para ser consumida tanto por personas como por sistemas de IA (chatbots, asistentes virtuales, etc.).

## Cursos Disponibles

### Curso 1: Grupos Étnicos

- **ID**: `1`
- **Nombre**: "Curso virtual de autoformación en Consulta Previa - Grupos étnicos"
- **Nombre corto**: "Curso - Grupos Etnicos (20hr)"
- **URL Section**: `20hr`
- **Form Key**: `20hr`

### Curso 2: Institucionales

- **ID**: `2`
- **Nombre**: "Curso virtual de autoformación en consulta previa para fortalecimiento de capacidades institucionales"
- **Nombre corto**: "Curso - Institucionales (20hr)"
- **URL Section**: `20hr-institucional`
- **Form Key**: `20hr-institucional`

### Curso 3: Diplomado Sociedad Civil

- **ID**: `3`
- **Nombre**: "Diplomado - Derecho Fundamental a la Consulta Previa"
- **Nombre corto**: "Diplomado - Sociedad civil"
- **URL Section**: `diplomado`
- **Form Key**: `diplomado`

### Curso 4: Diplomado Funcionarios

- **ID**: `4`
- **Nombre**: "Diplomado - Derecho Fundamental a la Consulta Previa"
- **Nombre corto**: "Diplomado - Funcionarios y/o Contratistas"
- **URL Section**: `diplomado-funcionarios`
- **Form Key**: `diplomado`

## Formularios y sus Diferencias

### Formulario Base: `20hr`

Contiene todos los campos estándar. Es la referencia para los demás formularios.

### Formulario: `20hr-institucional`

Idéntico al formulario `20hr` excepto por:

- **Campo `typeEntity`**: Solo opciones para funcionarios (valores 15 y 16)

### Formulario: `diplomado`

Similar al formulario `20hr-institucional` con estas diferencias:

- **Campo `typeEntity`**: Solo opciones para funcionarios (valores 15 y 16)
- **Campo `entityName`**: `field.required` comentado pero `rules.required` activo
- **Campo `continuar_curso_120`**: Oculto (CSS `display: none`) con valor por defecto "no"

## Campos Disponibles (Formulario Base: 20hr)

### 1. Nombres

- **Name**: `firstName`
- **Type**: `text`
- **Label**: "Nombres"
- **Required**: Sí
- **Validations**:
  - Pattern: `/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$/` (Solo letras y espacios)
  - Max Length: 150 caracteres
- **Error Messages**: "Este campo no puede estar vacio", "Por favor verifica el nombre"

### 2. Apellidos

- **Name**: `lastName`
- **Type**: `text`
- **Label**: "Apellidos"
- **Required**: Sí
- **Validations**:
  - Pattern: `/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$/` (Solo letras y espacios)
  - Max Length: 150 caracteres
- **Error Messages**: "Este campo no puede estar vacio", "Por favor verifica el apellido"

### 3. Tipo de Documento de Identidad

- **Name**: `identityDocument`
- **Type**: `select`
- **Label**: "Tipo de documento de identidad"
- **Required**: Sí
- **Options**:
  - `1`: "(CC) Cédula de ciudadanía"
  - `2`: "(CE) Cédula de extranjería"
  - `3`: "(PA) Pasaporte"
  - `4`: "(PR) Permiso de residencia"
  - `5`: "(TI) Tarjeta de identidad"

### 4. Número de Documento

- **Name**: `documentNumber`
- **Type**: `text`
- **Label**: "Número de documento"
- **Required**: Sí
- **Validations**:
  - Pattern: `/^[^.,\\s]+$/` (Sin espacios, puntos o comas)
  - Max Length: 20 caracteres
- **Error Messages**: "El número de documento no puede tener espacios, puntos o comas"

### 5. País de Expedición

- **Name**: `countryExpedition`
- **Type**: `async_select`
- **Label**: "País de expedición"
- **Required**: Sí
- **Default Value**: "CO"
- **Endpoint**: `${URI.FORM}/v1/countries`

### 6. Imágenes del Documento

- **Name**: `documentImages`
- **Type**: `document_upload`
- **Label**: "Documento de identidad (imágenes)"
- **Description**: Campo especial para subir frente y reverso del documento de identidad
- **Component**: DocumentImage

### 7. Fecha de Nacimiento

- **Name**: `birthdate`
- **Type**: `date`
- **Label**: "Fecha de nacimiento"
- **Required**: Sí
- **Component**: BirthdayField

### 8. País de Nacimiento

- **Name**: `countryBirth`
- **Type**: `async_select`
- **Label**: "País de nacimiento"
- **Required**: Sí
- **Default Value**: "CO"
- **Endpoint**: `${URI.FORM}/v1/countries`

### 9. Departamento de Nacimiento

- **Name**: `stateBirth`
- **Type**: `custom_async_select`
- **Label**: "Departamento de nacimiento"
- **Required**: Sí
- **Dependencies**: [`countryBirth`]
- **Endpoint**: `${URI.FORM}/v1/countries/$1/states`

### 10. Ciudad de Nacimiento

- **Name**: `cityBirth`
- **Type**: `custom_async_select`
- **Label**: "Ciudad de nacimiento"
- **Required**: Sí
- **Dependencies**: [`countryBirth`, `stateBirth`]
- **Endpoint**: `${URI.FORM}/v1/countries/$1/states/$2/cities`

### 11. Género

- **Name**: `gender`
- **Type**: `select`
- **Label**: "Género"
- **Required**: Sí
- **Options**:
  - `1`: "Femenino"
  - `2`: "Masculino"
  - `3`: "Transgénero"
  - `4`: "No binario"
  - `5`: "Prefiero no decirlo"
  - `0`: "Otro (especifique)"

### 12. Otro Género (Condicional)

- **Name**: `otherGender`
- **Type**: `conditional_text`
- **Label**: "Otro género (especificar)"
- **Required**: Sí (cuando se muestra)
- **Dependencies**: `gender`
- **Show When**: `gender === 0`
- **Component**: OtroCampo

### 13. Grupo Poblacional

- **Name**: `ethnicity`
- **Type**: `select`
- **Label**: "Grupo poblacional"
- **Required**: Sí
- **Options**:
  - `1`: "Indígena"
  - `2`: "Mestizo"
  - `3`: "Blanco"
  - `4`: "Rom"
  - `5`: "Raizal del Archipiélago de San Andrés y Providencia"
  - `6`: "Palenquero de San Basilio"
  - `7`: "Negro(a), afrocolombiano(a) o afrodescendiente"
  - `8`: "Mulato(a)"
  - `9`: "Ninguno de los anteriores"

### 14. Tipo de Entidad/Rol

- **Name**: `typeEntity`
- **Type**: `select`
- **Label**: "De los siguientes roles en cuál se reconoce?"
- **Required**: Sí

#### Para Formulario `20hr`

- `1`: "Comunidad Negro(a) afrocolombiano(a) o afrodescendiente"
- `2`: "Comunidad Indígena"
- `3`: "Ejecutores de procesos Consulta Previa"
- `4`: "Institucionalidad interviniente en Consulta Previa"
- `7`: "Población civil"
- `8`: "Empresario"
- `9`: "Educación"

#### Para Formularios `20hr-institucional` y `diplomado`

- `15`: "Funcionarios/contratistas del Ministerio del Interior"
- `16`: "Funcionarios/contratistas de otra entidad pública"

### 15. Nombre de la Entidad

- **Name**: `entityName`
- **Type**: `text`
- **Label**: "Nombre de la entidad u organización que representa"
- **Required**: Sí
- **Validations**:
  - Min Length: 3 caracteres
  - Max Length: 300 caracteres
- **Note**: En formulario `diplomado`, `field.required` está comentado pero `rules.required` permanece activo

### 16. Número de Teléfono

- **Name**: `phoneNumber`
- **Type**: `phone`
- **Label**: "Número de teléfono - WhatsApp"
- **Required**: Sí
- **Component**: PhoneNumber

### 17. Correo Electrónico

- **Name**: `email`
- **Type**: `email`
- **Label**: "Correo electrónico"
- **Required**: Sí
- **Validations**:
  - Pattern: `/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$/`
  - Max Length: 300 caracteres
- **Error Messages**: "Por favor verifica el correo"

### 18. Departamento de Residencia

- **Name**: `stateLocation`
- **Type**: `async_select`
- **Label**: "Departamento de residencia"
- **Required**: Sí
- **Endpoint**: `${URI.FORM}/v1/countries/CO/states`

### 19. Ciudad de Residencia

- **Name**: `cityLocation`
- **Type**: `custom_async_select`
- **Label**: "Ciudad de residencia"
- **Required**: Sí
- **Dependencies**: [`stateLocation`]
- **Endpoint**: `${URI.FORM}/v1/countries/CO/states/$1/cities`

### 20. Barrio de Residencia

- **Name**: `neighborhood`
- **Type**: `text`
- **Label**: "Barrio de residencia"
- **Required**: Sí
- **Validations**:
  - Max Length: 300 caracteres

### 21. Zona de Residencia

- **Name**: `zona`
- **Type**: `select`
- **Label**: "Zona de residencia"
- **Required**: Sí
- **Options**:
  - `"rural"`: "Rural"
  - `"urbana"`: "Urbana"

### 22. Acceso a Conexión de Internet

- **Name**: `connectivity`
- **Type**: `select`
- **Label**: "Acceso a conexión de internet"
- **Required**: Sí
- **Options**:
  - `"nula"`: "Sin conexión"
  - `"baja"`: "Solo con wifi público"
  - `"media"`: "Por intervalos de tiempo con dificultad"
  - `"plena"`: "Todo el día sin dificultad"
  - `"otra"`: "Otra (especificar)"

### 23. Otra Conectividad (Condicional)

- **Name**: `otra_conectividad`
- **Type**: `conditional_text`
- **Label**: "Otra conectividad (especificar)"
- **Required**: Sí (cuando se muestra)
- **Dependencies**: `connectivity`
- **Show When**: `connectivity === "otra"`
- **Validations**:
  - Max Length: 100 caracteres
- **Component**: OtroCampo

### 24. Interés en Diplomado 120 Horas

- **Name**: `continuar_curso_120`
- **Type**: `radio_large_question`
- **Label**: "Le interesa seguir fortaleciendo sus conocimiento y competencias sobre Consulta Previa a través de un diplomado virtual gratuito de 120 horas certificado por la Universidad del Valle."
- **Required**: Sí
- **Options**:
  - `"si"`: "Si"
  - `"no"`: "No"
- **Component**: LargeQuestion
- **Note**: En formulario `diplomado` está oculto (CSS `display: none`) con `defaultValue: "no"`

### 25. Autorización de Datos Personales

- **Name**: `processingOfPersonalData`
- **Type**: `checkbox`
- **Label**: "Autorización para el tratamiento de datos personales"
- **Required**: Sí
- **Description**: Checkbox con términos y condiciones
- **Component**: CheckboxField

## Tipos de Campo Técnicos

### `text`

Campo de texto simple con validaciones de patrón y longitud.

### `select`

Lista desplegable con opciones predefinidas. Valor puede ser numérico o string.

### `async_select`

Lista desplegable que carga opciones desde API. Requiere endpoint.

### `custom_async_select`

Lista desplegable que depende de otros campos. Las opciones se cargan dinámicamente basado en dependencias.

### `conditional_text`

Campo de texto que solo se muestra cuando se cumple una condición específica.

### `document_upload`

Campo especializado para subir imágenes de documentos (frente y reverso).

### `date`

Campo de fecha especializado para fechas de nacimiento.

### `phone`

Campo especializado para números de teléfono con formato.

### `email`

Campo de correo electrónico con validación específica.

### `radio_large_question`

Radio buttons para preguntas largas.

### `checkbox`

Checkbox simple para aceptación de términos.

## Patrones de Validación

### Nombres y Apellidos

```regex
/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$/
```

Solo permite letras (incluye acentos y ñ) y espacios.

### Número de Documento

```regex
/^[^.,\\s]+$/
```

No permite espacios, puntos o comas.

### Correo Electrónico

```regex
/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$/
```

Validación estándar de email.

## Endpoints API

### Base URL

`${URI.FORM}` (Variable de entorno)

### Países

- **GET** `/v1/countries`
- Retorna lista de países disponibles

### Estados/Departamentos por País

- **GET** `/v1/countries/{country_code}/states`
- Ejemplo: `/v1/countries/CO/states`

### Ciudades por Estado

- **GET** `/v1/countries/{country_code}/states/{state_id}/cities`
- Ejemplo: `/v1/countries/CO/states/1/cities`

### Específicos para Colombia

- **GET** `/v1/countries/CO/states` (Departamentos de Colombia)
- **GET** `/v1/countries/CO/states/{state_id}/cities` (Ciudades por departamento)

## Dependencias entre Campos

### Campos Condicionales

1. **`otherGender`** se muestra cuando `gender === 0`
2. **`otra_conectividad`** se muestra cuando `connectivity === "otra"`

### Campos con Dependencias API

1. **`stateBirth`** depende de `countryBirth`
2. **`cityBirth`** depende de `countryBirth` y `stateBirth`
3. **`cityLocation`** depende de `stateLocation`

## Componentes Especiales

### DocumentImage

Componente para subir frente y reverso del documento de identidad.

### LargeQuestion

Radio buttons para pregunta sobre interés en diplomado de 120 horas.

### CheckboxField

Checkbox para autorización de tratamiento de datos personales.

### OtroCampo

Campo condicional que se muestra según dependencias.

### PhoneNumber

Campo especializado para números de teléfono con formato.

### BirthdayField

Campo de fecha especializado para fechas de nacimiento.

## Guía para Implementación con IA/Chatbots

### Recopilación de Datos

1. **Orden sugerido**: Seguir el orden de los campos para mejor UX
2. **Campos obligatorios**: Todos los campos marcados como `required: true`
3. **Validación en tiempo real**: Aplicar patrones regex antes de envío
4. **Campos condicionales**: Solo solicitar cuando se cumplan las condiciones

### Manejo de Dependencias

1. **Selección de país**: Cargar estados/departamentos dinámicamente
2. **Selección de estado**: Cargar ciudades dinámicamente
3. **Campos condicionales**: Mostrar/ocultar según selecciones previas

### Validaciones Críticas

1. **Documento único**: Verificar que no exista duplicación
2. **Email válido**: Aplicar patrón regex
3. **Teléfono**: Formato válido para WhatsApp
4. **Fechas**: Validar rangos de edad apropiados

### Mensajes de Error

Usar los mensajes específicos definidos en `rules.message` para consistencia con la aplicación web.

### Diferenciación por Curso

- Verificar `form_key` del curso para aplicar campos específicos
- Ajustar opciones de `typeEntity` según el formulario
- Manejar campos ocultos en formulario `diplomado`

---
