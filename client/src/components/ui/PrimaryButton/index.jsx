import PropTypes from 'prop-types';

import classes from './style.module.scss';

const PrimaryButton = ({ children, onClick, className }) => (
  <button type="submit" onClick={onClick} className={`${classes.button} ${className}`}>
    {children}
  </button>
);

PrimaryButton.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default PrimaryButton;
