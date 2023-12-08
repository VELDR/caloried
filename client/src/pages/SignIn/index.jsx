import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import loginIllustration from '@static/images/login-illustration.svg';
import adminIllustration from '@static/images/admin-illustration.svg';
import { FormattedMessage, injectIntl } from 'react-intl';

import FormInput from '@components/ui/FormInput';
import { AlternateEmail, Key } from '@mui/icons-material';
import { login } from '@containers/Client/actions';

import classes from './style.module.scss';

const SignIn = ({ intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    const data = { email, password, isAdmin };

    dispatch(login(data, () => navigate('/diary')));
  };

  const handleAdminChange = (e) => {
    setIsAdmin(e.target.checked);
  };

  return (
    <div className={classes.container}>
      <div className={isAdmin ? `${classes.hero} ${classes.admin}` : `${classes.hero}`}>
        <div className={classes.hero__title}>
          {isAdmin ? 'Administrator Access Point' : 'Back for More Nutrition Wisdom?'}
        </div>
        <div className={classes.hero__description}>
          {isAdmin
            ? 'Access administrative controls and manage application settings.'
            : 'Log in to manage your diet and nutrition plans, crafted just for you.'}
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
            {!isAdmin && <div className={classes.form__forgot}>Forgot Password?</div>}
          </div>
          <div
            className={isAdmin ? `${classes.form__button} ${classes.admin}` : classes.form__button}
            onClick={handleLogin}
          >
            <FormattedMessage id="app_sign_in" />
          </div>
          {!isAdmin && (
            <div className={classes.form__signUp}>
              Dont have an account? <a href="/sign-up">Sign up</a>
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
