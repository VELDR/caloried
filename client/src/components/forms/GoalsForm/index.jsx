import PropTypes from 'prop-types';
import { useState } from 'react';
import { injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import toast from 'react-hot-toast';
import gain from '@static/images/gain.svg';
import lose from '@static/images/lose.svg';
import maintain from '@static/images/maintain.svg';
import FormFooter from '@components/forms/FormFooter';
import FormHeader from '@components/forms/FormHeader';

import { nextStep, setGoal } from '@pages/SignUp/actions';
import { selectGoal } from '@pages/SignUp/selectors';

import classes from './style.module.scss';

const GoalsForm = ({ goal, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const [selectedGoal, setSelectedGoal] = useState(goal);
  const goals = {
    lose: { label: formatMessage({ id: 'app_lose' }), image: lose },
    maintain: { label: formatMessage({ id: 'app_maintain' }), image: maintain },
    gain: { label: formatMessage({ id: 'app_gain' }), image: gain },
  };

  const handleGoalSelect = (newGoal) => {
    setSelectedGoal(newGoal);
  };

  const handleFormSubmit = () => {
    if (!selectedGoal) {
      toast.error(formatMessage({ id: 'app_error_goal' }));
    } else {
      dispatch(setGoal(selectedGoal));
      dispatch(nextStep());
    }
  };

  return (
    <div className={classes.form}>
      <FormHeader
        title={formatMessage({ id: 'app_goal_title' })}
        description={formatMessage({ id: 'app_goal_description' })}
      />

      <div className={classes.goal}>
        {Object.entries(goals).map(([key, { label, image }]) => (
          <div
            key={key}
            className={`${classes.goal__item} ${selectedGoal === key ? classes.active : ''}`}
            onClick={() => handleGoalSelect(key)}
          >
            <img className={classes.image} src={image} alt={label} />
            <div className={classes.label}>{label}</div>
          </div>
        ))}
      </div>

      <div className={classes.footer}>
        <FormFooter onContinue={handleFormSubmit} />
      </div>
    </div>
  );
};

GoalsForm.propTypes = {
  goal: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  goal: selectGoal,
});

export default injectIntl(connect(mapStateToProps)(GoalsForm));
