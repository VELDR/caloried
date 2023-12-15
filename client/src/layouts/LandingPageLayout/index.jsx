import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { selectTheme } from '@containers/App/selectors';
import { selectIsAdminLogin, selectLogin } from '@containers/Client/selectors';

import ThemeToggle from '@components/ui/ThemeToggle';
import TranslateDropdown from '@components/ui/TranslateDropdown';
import PrimaryButton from '@components/ui/PrimaryButton';
import SecondaryButton from '@components/ui/SecondaryButton';
import Logo from '@components/ui/Logo';

import classes from './style.module.scss';

const LandingPageLayout = ({ children, theme, login, isAdminLogin }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (login) {
      navigate('/diary');
    }
    if (isAdminLogin) {
      navigate('/admin');
    }
  }, [isAdminLogin, login, navigate]);

  return (
    <div>
      <div className={classes.headerWrapper} data-testid="navbar">
        <div className={classes.contentWrapper}>
          <div className={classes.left}>
            <Logo onClick={() => navigate('/diary')} className={classes.logo} />
          </div>
          <div className={classes.toolbar}>
            <div className={classes.button}>
              <SecondaryButton className={classes.button__secondary} onClick={() => navigate('/sign-in')}>
                <FormattedMessage id="app_sign_in" />
              </SecondaryButton>
              <PrimaryButton className={classes.button__primary} onClick={() => navigate('/sign-up')}>
                <FormattedMessage id="app_sign_up" />
              </PrimaryButton>
            </div>

            <div className={classes.misc}>
              <ThemeToggle theme={theme} />
              <TranslateDropdown />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

LandingPageLayout.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string,
  isAdminLogin: PropTypes.bool,
  login: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  isAdminLogin: selectIsAdminLogin,
  login: selectLogin,
});

export default connect(mapStateToProps)(LandingPageLayout);
