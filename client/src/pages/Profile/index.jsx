import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Avatar } from '@mui/material';
import { Balance, Edit, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import proteinIcon from '@static/images/protein.png';
import fatIcon from '@static/images/fat.png';
import carbsIcon from '@static/images/carbs.png';
import caloriesIcon from '@static/images/calories.svg';
import { isRoleMatch } from '@utils/authUtils';
import { getActivityLevel } from '@utils/formatUtils';
import { calculateAge } from '@utils/calculateUtils';
import config from '@config/index';

import EditProfileModal from '@components/profile/EditProfileModal';
import ChangePasswordModal from '@components/profile/ChangePasswordModal';
import { getUser } from '@pages/Diary/actions';
import { selectUser } from '@pages/Diary/selectors';
import { selectToken } from '@containers/Client/selectors';

import classes from './style.module.scss';

const Profile = ({ user, token, intl: { formatMessage } }) => {
  const dispatch = useDispatch();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    if (isRoleMatch(token, 'user')) {
      dispatch(getUser(token));
    }
  }, [dispatch, token]);

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleChangePasswordClick = () => {
    setIsChangePasswordOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setIsChangePasswordOpen(false);
  };

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
    <div className={classes.page}>
      <div className={classes.container}>
        <div className={classes.title}>
          <FormattedMessage id="app_my_profile" />
        </div>
        <div className={classes.header}>
          <div className={classes.avatar}>
            <Avatar src={`${config.api.base}${user?.avatar}`} className={classes.avatar__image} />
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
          <div className={classes.section}>
            <FormattedMessage id="app_physical_profile" />
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>
              <FormattedMessage id="app_sex" />
            </div>
            <div className={classes.profile__info}>
              <span>{user?.sex}</span>
            </div>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>
              <FormattedMessage id="app_age" />
            </div>
            <div className={classes.profile__info}>
              {calculateAge(user?.dob)} <FormattedMessage id="app_years_old" />
            </div>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>
              <FormattedMessage id="app_height" />
            </div>
            <div className={classes.profile__info}>{user?.height} cm</div>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>
              <FormattedMessage id="app_weight" />
            </div>
            <div className={classes.profile__info}>{user?.weight} kg</div>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile__label}>
              <FormattedMessage id="app_activity_level" />
            </div>
            <div className={classes.profile__info}>{getActivityLevel(user?.activityLevel)}</div>
          </div>
          <div className={classes.section}>
            <FormattedMessage id="app_nutritional_intake" />
          </div>
          <div className={classes.nutrition}>
            <div className={classes.nutrient}>
              <div className={classes.nutrient__label}>
                <FormattedMessage id="app_basal_metabolic_rate" />
              </div>
              <div className={classes.nutrient__info}>
                <img src={caloriesIcon} alt="" className={classes.icon} />
                {user?.bmr}{' '}
                <span>
                  kcal/
                  <FormattedMessage id="app_day" />
                </span>
              </div>
            </div>
            <div className={classes.nutrient}>
              <div className={classes.nutrient__label}>
                <FormattedMessage id="app_protein_intake" />
              </div>
              <div className={classes.nutrient__info}>
                <img src={proteinIcon} alt="" className={classes.icon} />
                {user?.proteinIntake}{' '}
                <span>
                  g/
                  <FormattedMessage id="app_day" />
                </span>
              </div>
            </div>
            <div className={classes.nutrient}>
              <div className={classes.nutrient__label}>
                <FormattedMessage id="app_carbs_intake" />
              </div>
              <div className={classes.nutrient__info}>
                <img src={carbsIcon} alt="" className={classes.icon} />
                {user?.carbsIntake}
                <span>
                  g/
                  <FormattedMessage id="app_day" />
                </span>
              </div>
            </div>
            <div className={classes.nutrient}>
              <div className={classes.nutrient__label}>
                <FormattedMessage id="app_fat_intake" />
              </div>
              <div className={classes.nutrient__info}>
                <img src={fatIcon} alt="" className={classes.icon} />
                {user?.fatIntake}
                <span>
                  g/
                  <FormattedMessage id="app_day" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          <div className={classes.footer__button} onClick={handleChangePasswordClick}>
            <FormattedMessage id="app_change_password" />
          </div>
        </div>
      </div>
      {user && <EditProfileModal open={isEditOpen} onClose={handleCloseEditModal} user={user} token={token} />}
      <ChangePasswordModal open={isChangePasswordOpen} onClose={handleCloseEditModal} token={token} />
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  token: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  token: selectToken,
});

export default injectIntl(connect(mapStateToProps)(Profile));
