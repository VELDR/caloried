import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import logo from '@static/images/not-found.svg';

import classes from './style.module.scss';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.contentWrapper} data-testid="not-found">
      <img className={classes.image} src={logo} alt="Not Found" />
      <div className={classes.title}>
        <FormattedMessage id="app_not_found" />
      </div>
      <div className={classes.button} onClick={() => navigate(-1)} data-testid="not-found-back">
        <FormattedMessage id="app_back" />
      </div>
    </div>
  );
};

export default NotFound;
