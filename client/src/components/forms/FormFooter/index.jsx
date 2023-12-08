import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { previousStep } from '@pages/SignUp/actions';

import { createStructuredSelector } from 'reselect';
import { selectCurrentStep } from '@pages/SignUp/selectors';

import SecondaryButton from '@components/ui/SecondaryButton';
import PrimaryButton from '@components/ui/PrimaryButton';

import classes from './style.module.scss';

const FormFooter = ({ currentStep, onContinue }) => {
  const dispatch = useDispatch();

  const handleNextStep = () => {
    onContinue();
  };

  const handlePreviousStep = () => {
    dispatch(previousStep());
  };

  return (
    <div className={classes.footer}>
      {currentStep > 0 && (
        <SecondaryButton onClick={handlePreviousStep} className={classes.footer__button}>
          <FormattedMessage id="app_button_previous" />
        </SecondaryButton>
      )}
      {currentStep < 3 && (
        <PrimaryButton onClick={handleNextStep} className={`${classes.footer__right} ${classes.footer__button}`}>
          <FormattedMessage id="app_button_next" />
        </PrimaryButton>
      )}
      {currentStep === 3 && (
        <PrimaryButton
          onClick={handleNextStep}
          className={`${classes.footer__right} ${classes.footer__confirm} ${classes.footer__button}`}
        >
          <FormattedMessage id="app_button_confirm" />
        </PrimaryButton>
      )}
    </div>
  );
};

FormFooter.propTypes = {
  currentStep: PropTypes.number,
  onContinue: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  currentStep: selectCurrentStep,
});

export default connect(mapStateToProps)(FormFooter);
