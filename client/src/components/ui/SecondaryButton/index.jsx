import PropTypes from 'prop-types';

import classes from './style.module.scss';

const SecondaryButton = ({ children, onClick, className }) => (
  <button type="button" onClick={onClick} className={`${classes.button} ${className}`} data-testid="navigate-sign-in">
    {children}
  </button>
);

SecondaryButton.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default SecondaryButton;
