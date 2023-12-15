import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { East, EditCalendar, PieChart, QueryStats, RestaurantMenu, Scale } from '@mui/icons-material';

import classes from './style.module.scss';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
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
      <div className={classes.featuresContainer}>
        <div className={classes.featuresTitle}>
          <FormattedMessage id="app_features" />
        </div>
        <div className={classes.features}>
          <div className={classes.features__item}>
            <PieChart />
            <div className={classes.description}>
              <div className={classes.title}>
                <FormattedMessage id="app_nutrition_tracking" />
              </div>
              <div className={classes.subtitle}>
                <FormattedMessage id="app_nutrition_tracking_description" />
              </div>
            </div>
          </div>
          <div className={classes.features__item}>
            <EditCalendar />
            <div className={classes.description}>
              <div className={classes.title}>
                <FormattedMessage id="app_meal_planning" />
              </div>
              <div className={classes.subtitle}>
                <FormattedMessage id="app_meal_planning_description" />
              </div>
            </div>
          </div>
          <div className={classes.features__item}>
            <Scale />
            <div className={classes.description}>
              <div className={classes.title}>
                <FormattedMessage id="app_weight_tracking" />
              </div>
              <div className={classes.subtitle}>
                <FormattedMessage id="app_weight_tracking_description" />
              </div>
            </div>
          </div>
          <div className={classes.features__item}>
            <RestaurantMenu />
            <div className={classes.description}>
              <div className={classes.title}>
                <FormattedMessage id="app_food_database" />
              </div>
              <div className={classes.subtitle}>
                <FormattedMessage id="app_food_database_description" />
              </div>
            </div>
          </div>
          <div className={classes.features__item}>
            <QueryStats />
            <div className={classes.description}>
              <div className={classes.title}>
                <FormattedMessage id="app_dashboard_analytics" />
              </div>
              <div className={classes.subtitle}>
                <FormattedMessage id="app_dashboard_analytics_description" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
