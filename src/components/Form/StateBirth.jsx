import PropTypes from "prop-types";
import { URI } from "../constant";
import DependentSelect from "./DependentSelect";

/**
 * Componente para seleccionar departamento de nacimiento
 * Depende de countryBirth
 */
export default function StateBirth({ formRef }) {
    return (
        <DependentSelect
            watchFields="countryBirth"
            urlBuilder={(country) =>
                country ? `${URI.FORM}/countries/${country}/states` : null
            }
            name="stateBirth"
            label="Departamento de nacimiento"
            required={true}
            formRef={formRef}
        />
    );
}

StateBirth.propTypes = {
    formRef: PropTypes.any,
};
