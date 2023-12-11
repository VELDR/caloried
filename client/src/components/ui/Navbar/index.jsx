import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import TranslateDropdown from '@components/ui/TranslateDropdown';
import ThemeToggle from '@components/ui/ThemeToggle';
import SearchBar from '@components/ui/SearchBar';
import ProfileMenu from '@components/profile/ProfileMenu';

import { selectUser } from '@pages/Diary/selectors';
import { selectToken } from '@containers/Client/selectors';
import { getUser } from '@pages/Diary/actions';

import classes from './style.module.scss';

const Navbar = ({ title, theme, user, token }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getUser(token));
    }
  }, [dispatch, token]);

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
          {user && <ProfileMenu user={user} />}
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  theme: PropTypes.string,
  user: PropTypes.object,
  token: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  token: selectToken,
});

export default connect(mapStateToProps)(Navbar);
