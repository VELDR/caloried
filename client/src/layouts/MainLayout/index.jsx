import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectTheme } from '@containers/App/selectors';

import Navbar from '@components/ui/Navbar';
import Sidebar from '@components/ui/Sidebar';
import BottomNavbar from '@components/ui/BottomNavbar';

const MainLayout = ({ children, theme, intl: { formatMessage } }) => (
  <div>
    <Navbar title={formatMessage({ id: 'app_title_header' })} theme={theme} />
    <Sidebar />
    <BottomNavbar />
    {children}
  </div>
);

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
});

export default injectIntl(connect(mapStateToProps)(MainLayout));
