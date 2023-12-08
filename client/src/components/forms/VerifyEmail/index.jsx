import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import mail from '@static/images/mail-sent.svg';

import { selectAccount } from '@pages/SignUp/selectors';
import { resendVerificationEmail } from '@containers/Client/actions';

import classes from './style.module.scss';

const VerifyEmail = ({ account }) => {
  const dispatch = useDispatch();

  const handleResend = () => {
    dispatch(resendVerificationEmail({ email: account.email }));
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
      <div className={classes.description}>
        <FormattedMessage id="app_click_on_link" />
        <span>
          <FormattedMessage id="app_check_spam" />
        </span>{' '}
        <FormattedMessage id="app_folder" />
      </div>
      <div className={classes.description}>
        <FormattedMessage id="app_still_cant_find" />
      </div>
      <div className={classes.footer}>
        <div className={classes.button} onClick={handleResend}>
          <FormattedMessage id="app_resend" />
        </div>
        <div className={classes.login}>
          <FormattedMessage id="app_already_verified" />{' '}
          <a href="/sign-in">
            <FormattedMessage id="app_sign_in_here" />
          </a>
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
