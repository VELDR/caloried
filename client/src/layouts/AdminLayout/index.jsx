import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';

import { selectTheme } from '@containers/App/selectors';
import ThemeToggle from '@components/ui/ThemeToggle';
import TranslateDropdown from '@components/ui/TranslateDropdown';
import { logoutUser } from '@containers/Client/actions';

import classes from './style.module.scss';

const AdminLayout = ({ children, theme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/sign-in');
  };

  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <ThemeToggle theme={theme} />
        <TranslateDropdown />
        <div className={classes.logout} onClick={handleLogout}>
          <Logout />
          <span>
            <FormattedMessage id="app_logout" />
          </span>
        </div>
      </div>
      {children}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
});

AdminLayout.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string,
};

export default connect(mapStateToProps)(AdminLayout);
