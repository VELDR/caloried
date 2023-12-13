import { useLocation, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { AutoStories, Dashboard, Fastfood, Person } from '@mui/icons-material';
import SearchBar from '@components/ui/SearchBar';

import classes from './style.module.scss';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to determine if the current path matches the given path
  const isActive = (path) => location.pathname === path;

  // Function to get the appropriate className for a navbar item
  const getItemClassName = (path) => `${classes.navbar__item} ${isActive(path) ? classes.active : ''}`;

  return (
    <div className={classes.bottomNav}>
      <div className={classes.searchBar}>
        <SearchBar />
      </div>
      <div className={classes.navbar}>
        <div className={getItemClassName('/dashboard')} onClick={() => navigate('/dashboard')}>
          <Dashboard />
          <div className={classes.label}>
            <FormattedMessage id="app_dashboard" />
          </div>
        </div>
        <div className={getItemClassName('/diary')} onClick={() => navigate('/diary')}>
          <AutoStories />
          <div className={classes.label}>
            <FormattedMessage id="app_diary" />
          </div>
        </div>
        <div className={getItemClassName('/search')} onClick={() => navigate('/search')}>
          <Fastfood />
          <div className={classes.label}>
            <FormattedMessage id="app_food" />
          </div>
        </div>
        <div className={getItemClassName('/profile')} onClick={() => navigate('/profile')}>
          <Person />
          <div className={classes.label}>
            <FormattedMessage id="app_profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
