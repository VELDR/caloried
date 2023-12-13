import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AlternateEmail, DoneAll, Info, Key, Person } from '@mui/icons-material';

import { nextStep, setAccount } from '@pages/SignUp/actions';
import { register } from '@containers/Client/actions';
import { selectAccount, selectActivityLevel, selectGoal, selectMetrics } from '@pages/SignUp/selectors';

import FormFooter from '@components/forms/FormFooter';
import FormHeader from '@components/forms/FormHeader';
import FormInput from '@components/ui/FormInput';

import classes from './style.module.scss';

const CreateAccount = ({ goal, metrics, activityLevel, account, intl: { formatMessage } }) => {
  const dispatch = useDispatch();

  const [accountData, setAccountData] = useState({
    username: account.username || '',
    email: account.email || '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };
  const { sex, dob, height, weight } = metrics;
  const { username, email } = accountData;

  const handleFormSubmit = () => {
    const combinedData = {
      ...accountData,
      goal,
      sex,
      dob,
      height,
      weight,
      activityLevel,
    };

    dispatch(setAccount({ username, email }));
    dispatch(
      register(combinedData, () => {
        dispatch(nextStep());
      })
    );
  };

  return (
    <div className={classes.container}>
      <FormHeader
        title={formatMessage({ id: 'app_account_title' })}
        description={formatMessage({ id: 'app_account_description' })}
      />
      <div className={classes.form}>
        <FormInput
          label={formatMessage({ id: 'app_username' })}
          icon={<Person />}
          type="text"
          name="username"
          value={accountData.username}
          onChange={handleInputChange}
        />
        <FormInput
          label={formatMessage({ id: 'app_email' })}
          icon={<AlternateEmail />}
          type="email"
          name="email"
          value={accountData.email}
          onChange={handleInputChange}
        />
        <FormInput
          label={formatMessage({ id: 'app_password' })}
          icon={<Key />}
          type="password"
          name="password"
          onChange={handleInputChange}
        />
        <FormInput
          label={formatMessage({ id: 'app_confirm_password' })}
          icon={<DoneAll />}
          type="password"
          name="confirmPassword"
          onChange={handleInputChange}
        />
        <div className={classes.form__info}>
          <Info /> <FormattedMessage id="app_info_verify" />
        </div>
      </div>
      <FormFooter onContinue={handleFormSubmit} />
    </div>
  );
};
CreateAccount.propTypes = {
  goal: PropTypes.string,
  metrics: PropTypes.object,
  activityLevel: PropTypes.number,
  account: PropTypes.object,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  goal: selectGoal,
  metrics: selectMetrics,
  activityLevel: selectActivityLevel,
  account: selectAccount,
});

export default injectIntl(connect(mapStateToProps)(CreateAccount));
