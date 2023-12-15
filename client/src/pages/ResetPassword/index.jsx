import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Key } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { jwtDecode } from 'jwt-decode';

import { resetPassword } from '@containers/Client/actions';
import FormInput from '@components/ui/FormInput';

import classes from './style.module.scss';

const ResetPassword = ({ intl: { formatMessage } }) => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const decoded = jwtDecode(token);

  const { email } = decoded;

  const handleReset = () => {
    dispatch(
      resetPassword({ email, newPassword: password, token }, () => {
        navigate('/sign-in');
      })
    );
  };

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.header__title}>
            <FormattedMessage id="app_reset_password_title" />
          </div>
          <div className={classes.header__description}>
            <FormattedMessage id="app_reset_password_description" />
          </div>
        </div>
        <div className={classes.form}>
          <FormInput
            label={formatMessage({ id: 'app_new_password' })}
            icon={<Key />}
            type="password"
            name="newPassword"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={classes.form__button} onClick={handleReset}>
            <FormattedMessage id="app_reset" />
          </div>
        </div>
      </div>
    </div>
  );
};

ResetPassword.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(ResetPassword);
