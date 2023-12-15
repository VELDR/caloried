import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';

const Logo = ({ onClick, className }) => (
  <div className={`${classes.logo} ${className}`} onClick={onClick}>
    <FormattedMessage id="app_title_header" />
  </div>
);

Logo.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Logo;
