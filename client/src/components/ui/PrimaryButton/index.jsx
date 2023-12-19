import PropTypes from 'prop-types';

import classes from './style.module.scss';

const PrimaryButton = ({ children, onClick, className, isSubmit = true }) => (
  <button
    type={isSubmit ? 'submit' : 'button'}
    onClick={onClick}
    className={`${classes.button} ${className}`}
    data-testid="navigate-sign-up"
  >
    {children}
  </button>
);

PrimaryButton.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isSubmit: PropTypes.bool,
};

export default PrimaryButton;
