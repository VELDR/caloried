import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Avatar } from '@mui/material';
import { Balance, Edit, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import proteinIcon from '@static/images/protein.png';
import fatIcon from '@static/images/fat.png';
import carbsIcon from '@static/images/carbs.png';
import caloriesIcon from '@static/images/calories.svg';
import { getActivityLevel } from '@utils/formatUtils';
import { calculateAge } from '@utils/calculateUtils';

import EditProfileModal from '@components/profile/EditProfileModal';
import { getUser } from '@pages/Diary/actions';
import { selectUser } from '@pages/Diary/selectors';
import { selectToken } from '@containers/Client/selectors';

import classes from './style.module.scss';

const Profile = ({ user, token }) => {
  const dispatch = useDispatch();

  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getUser(token));
    }
  }, [dispatch, token]);

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
  };

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
    <div className={classes.page}>
      <div className={classes.container}>
        <div className={classes.title}>My Profile</div>
        <div className={classes.header}>
          <div className={classes.avatar}>
            <Avatar src={`${import.meta.env.VITE_API_BASE_URL}${user?.avatar}`} className={classes.avatar__image} />
            <Edit className={classes.avatar__edit} onClick={handleEditClick} />
          </div>
          <div className={classes.heading}>
            <div className={classes.heading__username}>{user?.username}</div>
            <div className={classes.heading__email}>{user?.email}</div>
            <div className={`${classes.heading__goal} ${goalContent.className}`}>
              {goalContent.icon} {goalContent.text}
            </div>
          </div>
        </div>

        <div className={classes.body}>
          <div className={classes.section}>Physical Profile</div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>Sex</div>
            <div className={classes.profile__info}>
              <span>{user?.sex}</span>
            </div>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>Age</div>
            <div className={classes.profile__info}>{calculateAge(user?.dob)} years old </div>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>Height</div>
            <div className={classes.profile__info}>{user?.height} cm</div>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>Weight</div>
            <div className={classes.profile__info}>{user?.weight} kg</div>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>Activity Level</div>
            <div className={classes.profile__info}>{getActivityLevel(user?.activityLevel)}</div>
          </div>
          <div className={classes.section}>Nutritional Intake</div>
          <div className={classes.nutrition}>
            <div className={classes.nutrient}>
              <div className={classes.nutrient__label}>Basal Metabolic Rate (BMR)</div>
              <div className={classes.nutrient__info}>
                <img src={caloriesIcon} alt="" className={classes.icon} />
                {user?.bmr} <span>kcal/day</span>
              </div>
            </div>
            <div className={classes.nutrient}>
              <div className={classes.nutrient__label}>Protein Intake</div>
              <div className={classes.nutrient__info}>
                <img src={proteinIcon} alt="" className={classes.icon} />
                {user?.proteinIntake} <span>g/day</span>
              </div>
            </div>
            <div className={classes.nutrient}>
              <div className={classes.nutrient__label}>Carbohydrate Intake</div>
              <div className={classes.nutrient__info}>
                <img src={carbsIcon} alt="" className={classes.icon} />
                {user?.carbsIntake}
                <span>g/day</span>
              </div>
            </div>
            <div className={classes.nutrient}>
              <div className={classes.nutrient__label}>Fat Intake</div>
              <div className={classes.nutrient__info}>
                <img src={fatIcon} alt="" className={classes.icon} />
                {user?.fatIntake}
                <span>g/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {user && <EditProfileModal open={isEditOpen} onClose={handleCloseEditModal} user={user} token={token} />}
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  token: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  token: selectToken,
});

export default connect(mapStateToProps)(Profile);
