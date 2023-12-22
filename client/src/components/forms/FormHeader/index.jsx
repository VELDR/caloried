import PropTypes from 'prop-types';

import classes from './style.module.scss';

const FormHeader = ({ title, description }) => (
  <div className={classes.header} data-testid="form-header">
    <div className={classes.header__title}>{title}</div>
    <div className={classes.header__description}>{description}</div>
  </div>
);

FormHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default FormHeader;
