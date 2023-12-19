import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { AutoStories, Dashboard, Fastfood, Logout, Person } from '@mui/icons-material';
import { logoutUser } from '@containers/Client/actions';
import config from '@config/index';

import classes from './style.module.scss';

const ProfileMenu = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/sign-in');
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Avatar className={classes.avatarUser} src={`${config.api.base}${user?.avatar}`} onClick={handleAvatarClick} />

      <Menu
        className={classes.dropdownAvatar}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAvatarClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.userData}>
          <div className={classes.username}>{user?.username}</div>
          <div className={classes.email}>{user?.email}</div>
        </div>
        <div className={classes.divider} />
        <MenuItem onClick={() => navigate('/profile')} className={classes.dropdownAvatar__item}>
          <Person className={classes.dropdownIcon} />
          <div className={classes.dropdownText}>
            <FormattedMessage id="app_profile" />
          </div>
        </MenuItem>
        <MenuItem onClick={() => navigate('/dashboard')} className={classes.dropdownAvatar__item}>
          <Dashboard className={classes.dropdownIcon} />
          <div className={classes.dropdownText}>
            <FormattedMessage id="app_dashboard" />
          </div>
        </MenuItem>
        <MenuItem onClick={() => navigate('/diary')} className={classes.dropdownAvatar__item}>
          <AutoStories className={classes.dropdownIcon} />
          <div className={classes.dropdownText}>
            <FormattedMessage id="app_diary" />
          </div>
        </MenuItem>
        <MenuItem onClick={() => navigate('/search')} className={classes.dropdownAvatar__item}>
          <Fastfood className={classes.dropdownIcon} />
          <div className={classes.dropdownText}>
            <FormattedMessage id="app_food" />
          </div>
        </MenuItem>
        <MenuItem onClick={handleLogout} className={classes.dropdownAvatar__item}>
          <Logout className={`${classes.dropdownIcon} ${classes.logoutIcon}`} />
          <div className={`${classes.dropdownText} ${classes.logoutText}`}>
            <FormattedMessage id="app_logout" />
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};

ProfileMenu.propTypes = {
  user: PropTypes.object,
};

export default ProfileMenu;
