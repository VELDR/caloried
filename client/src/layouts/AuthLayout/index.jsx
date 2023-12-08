import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectTheme } from '@containers/App/selectors';
import ThemeToggle from '@components/ui/ThemeToggle';
import TranslateDropdown from '@components/ui/TranslateDropdown';

import classes from './style.module.scss';

const AuthLayout = ({ children, theme }) => (
  <div className={classes.container}>
    <div className={classes.toolbar}>
      <ThemeToggle theme={theme} />
      <TranslateDropdown />
    </div>
    {/* EB6666 */}
    <div className={`${classes.blob1} ${classes.blob}`} />
    <div className={`${classes.blob2} ${classes.blob}`} />
    <div className={`${classes.blob3} ${classes.blob}`} />
    <div className={`${classes.blob4} ${classes.blob}`} />
    <div className={`${classes.blob5} ${classes.blob}`} />
    {children}
  </div>
);

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
});

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string,
};

export default connect(mapStateToProps)(AuthLayout);
