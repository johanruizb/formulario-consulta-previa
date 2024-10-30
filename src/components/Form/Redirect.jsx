import { Navigate, useParams } from "react-router-dom";

import PropTypes from "prop-types";

function Redirect({ to = "/20hr" } = {}) {
    const { curso = "20hr" } = useParams();

    if (!["20hr", "20hr-institucional"].includes(curso))
        return <Navigate to={to} />;
}

Redirect.propTypes = {
    to: PropTypes.string,
};

export default Redirect;
