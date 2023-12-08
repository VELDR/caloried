import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import sedentary from '@static/images/sedentary.svg';
import light from '@static/images/lightly-active.svg';
import moderate from '@static/images/moderately-active.svg';
import very from '@static/images/very-active.svg';
import intense from '@static/images/intensely-active.svg';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

import { nextStep, setActivityLevel } from '@pages/SignUp/actions';
import { selectActivityLevel } from '@pages/SignUp/selectors';

import FormFooter from '@components/forms/FormFooter';
import FormHeader from '@components/forms/FormHeader';

import classes from './style.module.scss';

const ActivityLevel = ({ activityLevel, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const [selectedActivity, setSelectedActivity] = useState(activityLevel || 1);

  const activities = {
    1: {
      title: formatMessage({ id: 'app_sedentary' }),
      description: formatMessage({ id: 'app_sedentary_description' }),
      image: sedentary,
    },
    2: {
      title: formatMessage({ id: 'app_lightly_active' }),
      description: formatMessage({ id: 'app_lightly_active_description' }),
      image: light,
    },
    3: {
      title: formatMessage({ id: 'app_moderately_active' }),
      description: formatMessage({ id: 'app_moderately_active_description' }),
      image: moderate,
    },
    4: {
      title: formatMessage({ id: 'app_very_active' }),
      description: formatMessage({ id: 'app_very_active_description' }),
      image: very,
    },
    5: {
      title: formatMessage({ id: 'app_intensely_active' }),
      description: formatMessage({ id: 'app_intensely_active_description' }),
      image: intense,
    },
  };

  const handleActivitySelect = (id) => {
    setSelectedActivity(parseInt(id, 10));
  };

  const handleLeftClick = () => {
    if (selectedActivity > 1) {
      setSelectedActivity(selectedActivity - 1);
    }
  };

  const handleRightClick = () => {
    if (selectedActivity < Object.keys(activities).length) {
      setSelectedActivity(selectedActivity + 1);
    }
  };

  const handleFormSubmit = () => {
    dispatch(setActivityLevel(selectedActivity));
    dispatch(nextStep());
  };

  const activity = activities[selectedActivity];

  return (
    <div className={classes.form}>
      <FormHeader
        title={formatMessage({ id: 'app_activity_level_title' })}
        description={formatMessage({ id: 'app_activity_level_description' })}
      />

      <div className={classes.activity}>
        {selectedActivity > 1 && (
          <ChevronLeft className={`${classes.left} ${classes.arrow}`} onClick={handleLeftClick} />
        )}
        <img src={activity.image} alt={activity.title} className={classes.activity__image} />
        {selectedActivity < Object.keys(activities).length && (
          <ChevronRight className={`${classes.right} ${classes.arrow}`} onClick={handleRightClick} />
        )}

        <div className={classes.options}>
          <div className={classes.options__fill} style={{ width: `${selectedActivity * 20}%` }} />
          {Object.keys(activities).map((id) => (
            <div
              key={id}
              onClick={() => handleActivitySelect(id)}
              className={`${classes.options__item} ${selectedActivity >= id ? classes.active : ''}`}
            />
          ))}
        </div>
        <div className={classes.label}>
          <div className={classes.label__title}>{activity.title}</div>
          <div className={classes.label__description}>{activity.description}</div>
        </div>
      </div>
      <FormFooter onContinue={handleFormSubmit} />
    </div>
  );
};
ActivityLevel.propTypes = {
  activityLevel: PropTypes.number,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  activityLevel: selectActivityLevel,
});

export default injectIntl(connect(mapStateToProps)(ActivityLevel));
