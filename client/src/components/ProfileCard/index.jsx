import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { Balance, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';

import classes from './style.module.scss';

const ProfileCard = ({ user }) => {
  const navigate = useNavigate();
  const getGoalInfo = (goal) => {
    switch (goal) {
      case 'gain':
        return { icon: <KeyboardDoubleArrowUp />, text: 'Gaining Weight', className: classes.gainColor };
      case 'maintain':
        return { icon: <Balance />, text: 'Maintaining Weight', className: classes.maintainColor };
      case 'lose':
        return { icon: <KeyboardDoubleArrowDown />, text: 'Losing Weight', className: classes.loseColor };
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
            View Profile
          </div>
        </div>
      </div>
      <div className={classes.profile__footer}>
        <div className={classes.intake}>
          <div className={classes.intake__label}>Calories</div>
          <div className={classes.intake__value}>
            {user?.bmr} <span>kcal/day</span>
          </div>
        </div>
        <div className={classes.intake}>
          <div className={classes.intake__label}>Protein</div>
          <div className={classes.intake__value}>
            {user?.proteinIntake} <span>g/day</span>
          </div>
        </div>
        <div className={classes.intake}>
          <div className={classes.intake__label}>Carbs</div>
          <div className={classes.intake__value}>
            {user?.carbsIntake} <span>g/day</span>
          </div>
        </div>
        <div className={classes.intake}>
          <div className={classes.intake__label}>Fat</div>
          <div className={classes.intake__value}>
            {user?.fatIntake} <span>g/day</span>
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
};

export default ProfileCard;
