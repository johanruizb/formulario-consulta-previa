import PropTypes from "prop-types";

import { forwardRef } from "react";

import { IMaskInput } from "react-imask";

const PhoneMask = forwardRef(function PhoneMask(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
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
