import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import TranslateDropdown from '@components/ui/TranslateDropdown';
import ThemeToggle from '@components/ui/ThemeToggle';
import SearchBar from '@components/ui/SearchBar';
import ProfileMenu from '@components/profile/ProfileMenu';
import Logo from '@components/ui/Logo';

import { selectUser } from '@pages/Diary/selectors';
import { selectToken } from '@containers/Client/selectors';
import { getUser } from '@pages/Diary/actions';

import classes from './style.module.scss';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

const Navbar = ({ theme, user, token }) => {
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
          <Logo onClick={() => navigate('/diary')} />
          {user && (
            <div className={classes.search}>
              <SearchBar />
            </div>
          )}
        </div>
        <div className={classes.toolbar}>
          {!user && (
            <div className={classes.button}>
              <SecondaryButton className={classes.button__secondary} onClick={() => navigate('/sign-in')}>
                Sign in
              </SecondaryButton>
              <PrimaryButton className={classes.button__primary} onClick={() => navigate('/sign-up')}>
                Sign up
              </PrimaryButton>
            </div>
          )}
          <div className={classes.misc}>
            <ThemeToggle theme={theme} />
            <TranslateDropdown />
            {user && <ProfileMenu user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  theme: PropTypes.string,
  user: PropTypes.object,
  token: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  token: selectToken,
});

export default connect(mapStateToProps)(Navbar);
