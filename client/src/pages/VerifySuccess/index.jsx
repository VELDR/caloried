import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Verified } from '@mui/icons-material';

import classes from './style.module.scss';

const VerifySuccess = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <Verified className={classes.verified} />
      <div className={classes.title}>
        <FormattedMessage id="app_verification_success_title" />
      </div>
      <div className={classes.subtitle}>
        <FormattedMessage id="app_verification_success_description" />
      </div>
      <div className={classes.button} onClick={() => navigate('/sign-in')}>
        <FormattedMessage id="app_sign_in" />
      </div>
    </div>
  );
};

export default VerifySuccess;
