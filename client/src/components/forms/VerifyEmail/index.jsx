import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import OTPInput from 'react-otp-input';
import Countdown from 'react-countdown';
import Swal from 'sweetalert2';
import { createStructuredSelector } from 'reselect';
import mail from '@static/images/mail-sent.svg';

import { selectAccount } from '@pages/SignUp/selectors';
import { resetForm } from '@pages/SignUp/actions';
import { resendVerificationEmail, verifyOTP } from '@containers/Client/actions';

import classes from './style.module.scss';

const VerifyEmail = ({ account, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(null);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [endTime, setEndTime] = useState(Date.now() + 30000);

  const handleResend = () => {
    dispatch(
      resendVerificationEmail({ email: account.email }, () => {
        setIsResendDisabled(true);
        setEndTime(Date.now() + 30000);
        setTimerKey((prevKey) => prevKey + 1);
      })
    );
  };

  const handleSubmitOTP = () => {
    dispatch(
      verifyOTP(otp, account.email, () => {
        Swal.fire({
          title: formatMessage({ id: 'app_verification_success_title' }),
          text: formatMessage({ id: 'app_verification_success_description' }),
          icon: 'success',
          confirmButtonText: formatMessage({ id: 'app_sign_in' }),
          confirmButtonColor: 'var(--color-primary)',
          background: 'var(--color-bg-secondary)',
          customClass: {
            title: classes.swalTitle,
            confirmButton: classes.swalButton,
            popup: classes.swalPopup,
          },
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(resetForm());
            navigate('/sign-in');
          }
        });
      })
    );
  };

  useEffect(() => {
    setIsResendDisabled(true);
    setEndTime(Date.now() + 30000);
  }, []);

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed && isResendDisabled) {
      setIsResendDisabled(false);
      return <span className={classes.countdown}>00:00</span>;
    }

    return (
      <span className={classes.countdown}>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    );
  };

  return (
    <div className={classes.container} data-testid="verify-email">
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
          <FormattedMessage id="app_submit" />
        </div>
      </div>
      <div className={classes.description}>
        <span
          className={`${classes.link} ${isResendDisabled ? classes.disabledLink : ''}`}
          onClick={!isResendDisabled ? handleResend : null}
        >
          <FormattedMessage id="app_resend" />
        </span>{' '}
        in <Countdown date={endTime} renderer={renderer} key={timerKey} />
      </div>
    </div>
  );
};

VerifyEmail.propTypes = {
  account: PropTypes.object,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  account: selectAccount,
});

export default injectIntl(connect(mapStateToProps)(VerifyEmail));
