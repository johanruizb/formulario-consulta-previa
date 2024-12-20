import { useNavigate, useParams } from "react-router-dom";

import PropTypes from "prop-types";

function Redirect({ to = "/404" } = {}) {
    const { curso = "20hr" } = useParams();
    const navigate = useNavigate();

    if (
        ![
            "diplomado-etnicos",
            // "diplomado-funcionarios",
            "20hr",
            "20hr-institucional",
        ].includes(curso)
    )
        navigate(to, { replace: true });
}

Redirect.propTypes = {
    to: PropTypes.string,
};

export default Redirect;
