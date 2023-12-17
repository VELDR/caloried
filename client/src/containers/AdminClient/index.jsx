import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { isRoleMatch } from '@utils/authUtils';
import { selectIsAdminLogin, selectToken } from '@containers/Client/selectors';

const AdminClient = ({ isAdminLogin, token, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !isRoleMatch(token, 'admin')) {
      navigate('/dashboard');
    } else if (!isAdminLogin) {
      navigate('/sign-in');
    }
  }, [isAdminLogin, navigate, token]);
  return children;
};

AdminClient.propTypes = {
  isAdminLogin: PropTypes.bool,
  children: PropTypes.element,
  token: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  isAdminLogin: selectIsAdminLogin,
  token: selectToken,
});

export default connect(mapStateToProps)(AdminClient);
