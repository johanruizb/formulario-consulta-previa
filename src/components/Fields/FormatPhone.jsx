import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import { forwardRef } from "react";
// import { COLOMBIA } from "../constant";

const PhoneMask = forwardRef(function PhoneMask(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            // mask={`+${COLOMBIA.phonecode} #00 000 0000`}
            mask={`#00 000 0000`}
            definitions={{
                "#": /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) =>
                onChange({ target: { name: props.name, value } })
            }
            overwrite
        />
    );
});

PhoneMask.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default PhoneMask;
