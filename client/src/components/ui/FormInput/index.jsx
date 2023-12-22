import PropTypes from 'prop-types';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import classes from './style.module.scss';

const FormInput = ({ label, type, name, icon, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={classes.form}>
      <div className={classes.form__label}>{label}</div>
      <div className={classes.form__input}>
        {icon}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          data-testid={`form-input-${type}`}
        />
        {type === 'password' && (
          <div onClick={handleTogglePasswordVisibility} className={classes.eyeIcon}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </div>
        )}
      </div>
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  icon: PropTypes.element,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default FormInput;
