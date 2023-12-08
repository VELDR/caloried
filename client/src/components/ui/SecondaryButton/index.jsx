import PropTypes from 'prop-types';

import classes from './style.module.scss';

const SecondaryButton = ({ children, onClick, className }) => (
  <button type="button" onClick={onClick} className={`${classes.button} ${className}`}>
    {children}
  </button>
);

SecondaryButton.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default SecondaryButton;
