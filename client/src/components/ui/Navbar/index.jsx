import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

import TranslateDropdown from '@components/ui/TranslateDropdown';
import ThemeToggle from '@components/ui/ThemeToggle';
import SearchBar from '@components/SearchBar';

import classes from './style.module.scss';

const Navbar = ({ title, theme }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.headerWrapper} data-testid="navbar">
      <div className={classes.contentWrapper}>
        <div className={classes.left}>
          <div className={classes.logoImage} onClick={() => navigate('/diary')}>
            <div className={classes.title}>{title}</div>
          </div>
          <div className={classes.search}>
            <SearchBar />
          </div>
        </div>
        <div className={classes.toolbar}>
          <ThemeToggle theme={theme} />
          <TranslateDropdown />
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  theme: PropTypes.string,
};

export default Navbar;
