import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectIsAdminLogin, selectLogin } from '@containers/Client/selectors';

const Client = ({ login, isAdminLogin, children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!login && !isAdminLogin) {
      navigate('/sign-in');
    }
  }, [isAdminLogin, login, navigate]);
  return children;
};

Client.propTypes = {
  login: PropTypes.bool,
  isAdminLogin: PropTypes.bool,
  children: PropTypes.element,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  isAdminLogin: selectIsAdminLogin,
});

export default connect(mapStateToProps)(Client);
