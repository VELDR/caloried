import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { AccessibilityNew, FitnessCenter, Flag, Person } from '@mui/icons-material';

import FormCard from '@components/forms/FormCard';
import { selectCurrentStep } from './selectors';

import classes from './style.module.scss';

const SignUp = ({ currentStep }) => (
  <div className={classes.register}>
    <div className={classes.progressContainer}>
      <div className={`${classes.progress} ${currentStep === 0 ? classes.active : ''}`}>
        <div className={classes.progress__item}>
          <Flag />
        </div>
        <div className={classes.progress__label}>
          <FormattedMessage id="app_weight_goals" />
        </div>
      </div>
      <div className={`${classes.progress} ${currentStep === 1 ? classes.active : ''}`}>
        <div className={classes.progress__item}>
          <AccessibilityNew />
        </div>
        <div className={classes.progress__label}>
          <FormattedMessage id="app_metrics_title" />
        </div>
      </div>
      <div className={`${classes.progress} ${currentStep === 2 ? classes.active : ''}`}>
        <div className={classes.progress__item}>
          <FitnessCenter />
        </div>
        <div className={classes.progress__label}>
          <FormattedMessage id="app_activity_level" />
        </div>
      </div>
      <div className={`${classes.progress} ${currentStep === 3 ? classes.active : ''}`}>
        <div className={classes.progress__item}>
          <Person />
        </div>
        <div className={classes.progress__label}>
          <FormattedMessage id="app_account_setup" />
        </div>
      </div>
    </div>
    <FormCard />
  </div>
);

SignUp.propTypes = {
  currentStep: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  currentStep: selectCurrentStep,
});

export default connect(mapStateToProps)(SignUp);
