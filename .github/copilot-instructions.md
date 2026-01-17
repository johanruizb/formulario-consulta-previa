# Consulta Previa Frontend - AI Coding Guidelines

## 🔴 Reglas Críticas

- **Solo código solicitado**: Sin pruebas, ejemplos ni comentarios innecesarios
- **Sin archivos adicionales**: No crear README/markdown salvo solicitud explícita
- **Sentence case**: Solo primera letra mayúscula en UI
- **MCP obligatorio**: Usar sequential-thinking server

## Arquitectura

**React 18 + Vite** (puerto 7153) → Build a `../consulta-previa-proxy`

| Carpeta | Propósito |
|---------|-----------|
| `src/components/` | Componentes UI reutilizables |
| `src/pages/` | Vistas/rutas principales |
| `src/hooks/` | Custom hooks |
| `src/services/` | API calls (enrollmentService.js) |
| `src/contexts/` | React Context providers |
| `src/config/` | Configuración (courseAssets, validationRules) |
| `src/theme/` | MUI theming |

## Stack Principal

- **UI**: MUI Material v6 + Joy
- **Data**: SWR para fetching/cache
- **Forms**: react-hook-form
- **Routing**: react-router-dom
- **CAPTCHA**: @marsidev/react-turnstile
- **Dates**: dayjs + @mui/x-date-pickers

## Patrones

### Data Fetching (SWR)
```javascript
import useSWR from "swr";
const { data, error, isLoading } = useSWR(url, fetcher);
```

### Formularios
```javascript
import { useForm } from "react-hook-form";
const { register, handleSubmit, formState: { errors } } = useForm();
```

### Componentes MUI
- Usar MUI Joy para componentes principales
- MUI Material para componentes específicos
- Consultar mui-mcp para documentación actualizada

## Build

```bash
npm run dev              # Desarrollo (puerto 7153)
npm run build            # Producción → ../consulta-previa-proxy
npm run dev:testing      # Modo testing
npm run test:e2e         # Playwright tests
```

## Estructura de Assets

```
src/assets/
├── curso/              # Assets por curso
├── diplomado/          # Materiales diplomado
└── diplomado-etnicos/  # Materiales específicos
```

## Integración

- **Backend**: Django API (configurado via env vars)
- **Proxy build**: Archivos estáticos van a `consulta-previa-proxy/`
- **CAPTCHA**: Cloudflare Turnstile integrado en formularios
