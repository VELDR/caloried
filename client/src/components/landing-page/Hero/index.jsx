import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { East } from '@mui/icons-material';

import classes from './style.module.scss';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.heroContainer}>
      <div className={classes.hero}>
        <div className={classes.heroTitle}>
          <FormattedMessage id="app_hero_title" />
        </div>
        <div className={classes.heroSubtitle}>
          <FormattedMessage id="app_hero_subtitle" />
        </div>
        <div className={classes.heroDescription}>
          <FormattedMessage id="app_hero_description" />
        </div>
        <div className={classes.heroButton} onClick={() => navigate('/sign-up')}>
          <span>
            <FormattedMessage id="app_hero_button" />
          </span>
          <East className={classes.buttonArrow} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
