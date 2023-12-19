import PropTypes from 'prop-types';
import { useState } from 'react';
import { injectIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { AutoStories, ChevronLeft, ChevronRight, Dashboard, Fastfood, Person } from '@mui/icons-material';

import classes from './style.module.scss';

const Sidebar = ({ intl: { formatMessage } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  const getItemClassName = (path) => `${classes.sidebar__item} ${isActive(path) ? classes.active : ''}`;

  return (
    <div className={classes.container} data-testid="sidebar">
      {isOpen && (
        <div className={classes.sidebar}>
          <div
            className={getItemClassName('/dashboard')}
            onClick={() => navigate('/dashboard')}
            data-testid="side-navigate-dashboard"
          >
            <Tooltip arrow title={formatMessage({ id: 'app_dashboard' })}>
              <Dashboard />
            </Tooltip>
          </div>
          <div
            className={getItemClassName('/diary')}
            onClick={() => navigate('/diary')}
            data-testid="side-navigate-diary"
          >
            <Tooltip arrow title={formatMessage({ id: 'app_diary' })}>
              <AutoStories />
            </Tooltip>
          </div>
          <div
            className={getItemClassName('/search')}
            onClick={() => navigate('/search')}
            data-testid="side-navigate-search"
          >
            <Tooltip arrow title={formatMessage({ id: 'app_food' })}>
              <Fastfood />
            </Tooltip>
          </div>
          <div
            className={getItemClassName('/profile')}
            onClick={() => navigate('/profile')}
            data-testid="side-navigate-profile"
          >
            <Tooltip arrow title={formatMessage({ id: 'app_profile' })}>
              <Person />
            </Tooltip>
          </div>
        </div>
      )}

      <div className={classes.chevron} onClick={toggleSidebar} data-testid="toggle-sidebar">
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(Sidebar);
