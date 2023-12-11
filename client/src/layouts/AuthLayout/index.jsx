import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { selectTheme } from '@containers/App/selectors';
import { selectLogin } from '@containers/Client/selectors';
import ThemeToggle from '@components/ui/ThemeToggle';
import TranslateDropdown from '@components/ui/TranslateDropdown';

import classes from './style.module.scss';

const AuthLayout = ({ children, theme, login }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (login) {
      navigate('/diary');
    }
  }, [login, navigate]);
  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <ThemeToggle theme={theme} />
        <TranslateDropdown />
      </div>
      <div className={`${classes.blob1} ${classes.blob}`} />
      <div className={`${classes.blob2} ${classes.blob}`} />
      <div className={`${classes.blob3} ${classes.blob}`} />
      <div className={`${classes.blob4} ${classes.blob}`} />
      <div className={`${classes.blob5} ${classes.blob}`} />
      {children}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  login: selectLogin,
});

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string,
  login: PropTypes.bool,
};

export default connect(mapStateToProps)(AuthLayout);
