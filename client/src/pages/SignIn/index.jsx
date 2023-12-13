import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import loginIllustration from '@static/images/login-illustration.svg';
import adminIllustration from '@static/images/admin-illustration.svg';
import { FormattedMessage, injectIntl } from 'react-intl';

import FormInput from '@components/ui/FormInput';
import { AlternateEmail, Key } from '@mui/icons-material';
import { adminLogin, login } from '@containers/Client/actions';

import classes from './style.module.scss';

const SignIn = ({ intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    const data = { email, password };
    if (isAdmin) {
      dispatch(
        adminLogin(data, () => {
          navigate('/admin');
        })
      );
    } else {
      dispatch(
        login(data, () => {
          navigate('/diary');
        })
      );
    }
  };

  const handleAdminChange = (e) => {
    setIsAdmin(e.target.checked);
  };

  return (
    <div className={classes.container}>
      <div className={isAdmin ? `${classes.hero} ${classes.admin}` : `${classes.hero}`}>
        <div className={classes.hero__title}>
          {isAdmin ? formatMessage({ id: 'app_admin_sign_in_title' }) : formatMessage({ id: 'app_user_sign_in_title' })}
        </div>
        <div className={classes.hero__description}>
          {isAdmin
            ? formatMessage({ id: 'app_admin_sign_in_description' })
            : formatMessage({ id: 'app_user_sign_in_description' })}
        </div>
        <img src={isAdmin ? adminIllustration : loginIllustration} alt="Food Illustration" />
      </div>
      <div className={classes.signIn}>
        <div className={classes.signIn__title}>
          <FormattedMessage id="app_sign_in" />
        </div>
        <div className={classes.form}>
          <FormInput
            label={formatMessage({ id: 'app_email' })}
            icon={<AlternateEmail />}
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <FormInput
              label={formatMessage({ id: 'app_password' })}
              icon={<Key />}
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isAdmin && (
              <div className={classes.form__forgot}>
                <FormattedMessage id="app_forgot_password" />
              </div>
            )}
          </div>
          <div
            className={isAdmin ? `${classes.form__button} ${classes.admin}` : classes.form__button}
            onClick={handleLogin}
          >
            <FormattedMessage id="app_sign_in" />
          </div>
          {!isAdmin && (
            <div className={classes.form__signUp}>
              <FormattedMessage id="app_dont_have_account" />{' '}
              <a href="/sign-up">
                <FormattedMessage id="app_sign_up" />
              </a>
            </div>
          )}
          <div className={classes.option}>
            <div className={isAdmin ? classes.option__text : `${classes.option__selected} ${classes.option__text}`}>
              User
            </div>

            <label htmlFor="switch" className={classes.option__toggle}>
              <input
                type="checkbox"
                id="switch"
                className={classes.option__checkbox}
                checked={isAdmin}
                onChange={handleAdminChange}
              />
              <span className={classes.option__slider} id="round" />
            </label>
            <div className={isAdmin ? `${classes.option__selected} ${classes.option__text}` : classes.option__text}>
              Admin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(SignIn);
