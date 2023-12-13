import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectTheme } from '@containers/App/selectors';
import { selectIsAdminLogin } from '@containers/Client/selectors';

import Navbar from '@components/ui/Navbar';
import Sidebar from '@components/ui/Sidebar';
import BottomNavbar from '@components/ui/BottomNavbar';

const MainLayout = ({ children, theme, isAdminLogin, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAdminLogin) {
      navigate('/admin');
    }
  }, [isAdminLogin, navigate]);

  return (
    <div>
      <Navbar title={formatMessage({ id: 'app_title_header' })} theme={theme} />
      <Sidebar />
      <BottomNavbar />
      {children}
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string,
  intl: PropTypes.object,
  isAdminLogin: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  isAdminLogin: selectIsAdminLogin,
});

export default injectIntl(connect(mapStateToProps)(MainLayout));
