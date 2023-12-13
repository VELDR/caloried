import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Avatar } from '@mui/material';
import { Balance, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';

import classes from './style.module.scss';

const ProfileCard = ({ user, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const getGoalInfo = (goal) => {
    switch (goal) {
      case 'gain':
        return {
          icon: <KeyboardDoubleArrowUp />,
          text: formatMessage({ id: 'app_gaining_weight' }),
          className: classes.gainColor,
        };
      case 'maintain':
        return {
          icon: <Balance />,
          text: formatMessage({ id: 'app_maintaining_weight' }),
          className: classes.maintainColor,
        };
      case 'lose':
        return {
          icon: <KeyboardDoubleArrowDown />,
          text: formatMessage({ id: 'app_losing_weight' }),
          className: classes.loseColor,
        };
      default:
        return { icon: null, text: '', className: '' };
    }
  };

  const goalContent = getGoalInfo(user?.goal);

  return (
    <div className={classes.profile}>
      <div className={classes.profile__header}>
        <Avatar src={`${import.meta.env.VITE_API_BASE_URL}${user?.avatar}`} className={classes.avatar} />
        <div className={classes.identity}>
          <div className={classes.username}>{user?.username}</div>
          <div className={classes.email}>{user?.email}</div>
          <div className={classes.button} onClick={() => navigate('/profile')}>
            <FormattedMessage id="app_view_profile" />
          </div>
        </div>
      </div>
      <div className={classes.profile__footer}>
        <div className={classes.intake}>
          <div className={classes.intake__label}>
            <FormattedMessage id="app_calories" />
          </div>
          <div className={classes.intake__value}>
            {user?.bmr}{' '}
            <span>
              kcal/
              <FormattedMessage id="app_day" />
            </span>
          </div>
        </div>
        <div className={classes.intake}>
          <div className={classes.intake__label}>
            <FormattedMessage id="app_protein" />
          </div>
          <div className={classes.intake__value}>
            {user?.proteinIntake}{' '}
            <span>
              g/
              <FormattedMessage id="app_day" />
            </span>
          </div>
        </div>
        <div className={classes.intake}>
          <div className={classes.intake__label}>
            <FormattedMessage id="app_carbs" />
          </div>
          <div className={classes.intake__value}>
            {user?.carbsIntake}{' '}
            <span>
              g/
              <FormattedMessage id="app_day" />
            </span>
          </div>
        </div>
        <div className={classes.intake}>
          <div className={classes.intake__label}>
            <FormattedMessage id="app_fat" />
          </div>
          <div className={classes.intake__value}>
            {user?.fatIntake}{' '}
            <span>
              g/
              <FormattedMessage id="app_day" />
            </span>
          </div>
        </div>
      </div>
      <div className={`${classes.goal} ${goalContent.className}`}>
        {goalContent.icon} {goalContent.text}
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  user: PropTypes.object,
  intl: PropTypes.object,
};

export default injectIntl(ProfileCard);
