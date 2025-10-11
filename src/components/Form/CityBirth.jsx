import PropTypes from "prop-types";
import { URI } from "../constant";
import DependentSelect from "./DependentSelect";

/**
 * Componente para seleccionar ciudad de nacimiento
 * Depende de countryBirth y stateBirth
 */
export default function CityBirth({ formRef }) {
    return (
        <DependentSelect
            watchFields={["countryBirth", "stateBirth"]}
            urlBuilder={([country, state]) =>
                country && state
                    ? `${URI.FORM}/countries/${country}/states/${state}/cities`
                    : null
            }
            name="cityBirth"
            label="Ciudad de nacimiento"
            required={true}
            formRef={formRef}
        />
    );
}

CityBirth.propTypes = {
    formRef: PropTypes.any,
};
