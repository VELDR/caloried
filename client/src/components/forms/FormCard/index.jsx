import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentStep } from '@pages/SignUp/selectors';
import Welcome from '@components/forms/Welcome';
import GoalsForm from '@components/forms/GoalsForm';
import BodyMetrics from '@components/forms/BodyMetrics';
import ActivityLevel from '@components/forms/ActivityLevel';
import CreateAccount from '@components/forms/CreateAccount';
import VerifyEmail from '@components/forms/VerifyEmail';

import classes from './style.module.scss';

const formMap = {
  0: Welcome,
  1: GoalsForm,
  2: BodyMetrics,
  3: ActivityLevel,
  4: CreateAccount,
  5: VerifyEmail,
};

const FormCard = ({ currentStep }) => {
  const CurrentForm = formMap[currentStep];
  return (
    <div className={classes.formContainer}>
      <CurrentForm />
    </div>
  );
};

FormCard.propTypes = {
  currentStep: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  currentStep: selectCurrentStep,
});

export default connect(mapStateToProps)(FormCard);
