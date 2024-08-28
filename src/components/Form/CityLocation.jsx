import { useFormContext, useWatch } from "react-hook-form";
import AsyncSelect from "../Fields/AsyncSelect";
import { URI } from "../constant";

function CityLocation() {
    const { control } = useFormContext();
    const stateLocation = useWatch({
        control: control,
        name: "stateLocation",
    });

    return (
        <AsyncSelect
            fetchProps={{
                url: stateLocation
                    ? `${URI.FORM}/v1/countries/CO/states/${stateLocation}/cities`
                    : null,
            }}
            slotProps={{
                controller: {
                    name: "cityLocation",
                    defaultValue: "",
                    rules: {
                        required: {
                            value: true,
                            message: "Este campo no puede estar vacio",
                        },
                    },
                },
                field: {
                    label: "Ciudad de residencia",
                    required: true,
                },
            }}
        />
    );
}

export default CityLocation;
