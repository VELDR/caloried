import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { nextStep } from '@pages/SignUp/actions';
import FormFooter from '@components/forms/FormFooter';

import classes from './style.module.scss';

const Welcome = () => {
  const dispatch = useDispatch();
  return (
    <div className={classes.container} data-testid="welcome">
      <div className={classes.body}>
        <div className={classes.title}>
          <FormattedMessage id="app_welcome_title" />
          🌱
        </div>
        <div className={classes.subtitle}>
          <FormattedMessage id="app_welcome_subtitle" />
          🎯
        </div>
      </div>
      <div className={classes.footer}>
        <FormFooter onContinue={() => dispatch(nextStep())} />
      </div>
    </div>
  );
};

export default Welcome;
