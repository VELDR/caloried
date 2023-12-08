import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentStep } from '@pages/SignUp/selectors';
import GoalsForm from '@components/forms/GoalsForm';
import BodyMetrics from '@components/forms/BodyMetrics';
import ActivityLevel from '@components/forms/ActivityLevel';
import CreateAccount from '@components/forms/CreateAccount';
import VerifyEmail from '@components/forms/VerifyEmail';

import classes from './style.module.scss';

const formMap = {
  0: GoalsForm,
  1: BodyMetrics,
  2: ActivityLevel,
  3: CreateAccount,
  4: VerifyEmail,
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
