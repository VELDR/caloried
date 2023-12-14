import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import OTPInput from 'react-otp-input';
import { createStructuredSelector } from 'reselect';
import mail from '@static/images/mail-sent.svg';

import { selectAccount } from '@pages/SignUp/selectors';
import { resendVerificationEmail, verifyOTP } from '@containers/Client/actions';

import classes from './style.module.scss';

const VerifyEmail = ({ account }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(null);

  const handleResend = () => {
    dispatch(resendVerificationEmail({ email: account.email }));
  };

  const handleSubmitOTP = () => {
    dispatch(
      verifyOTP(otp, account.email, () => {
        navigate('/verify-success');
      })
    );
  };

  return (
    <div className={classes.container}>
      <img src={mail} alt="Email sent illustration" />

      <div className={classes.title}>
        <FormattedMessage id="app_verify_email" />
      </div>

      <div>
        <div className={classes.description}>
          <FormattedMessage id="app_we_sent_email" />
        </div>
        <div className={classes.email}>{account.email}</div>
      </div>
      <div className={classes.otp}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
        />
        <div className={classes.button} onClick={handleSubmitOTP}>
          Submit
        </div>
      </div>

      <div className={classes.description}>
        <FormattedMessage id="app_still_cant_find" />
        <div className={classes.link} onClick={handleResend}>
          <FormattedMessage id="app_resend" />
        </div>
      </div>
    </div>
  );
};

VerifyEmail.propTypes = {
  account: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  account: selectAccount,
});

export default connect(mapStateToProps)(VerifyEmail);
