import { Tooltip } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export const renderTooltip = (props, content, className) => (
    <Tooltip id="button-tooltip" {...props} className={`${className}`}>
        {content}
    </Tooltip>
);