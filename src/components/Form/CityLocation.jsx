import { URI } from "../constant";
import DependentSelect from "./DependentSelect";

/**
 * Componente para seleccionar ciudad de residencia
 * Depende de stateLocation
 */
export default function CityLocation() {
    return (
        <DependentSelect
            watchFields="stateLocation"
            urlBuilder={(state) =>
                state ? `${URI.FORM}/countries/CO/states/${state}/cities` : null
            }
            name="cityLocation"
            label="Ciudad de residencia"
            required={true}
        />
    );
}
