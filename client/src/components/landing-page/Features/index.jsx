import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { EditCalendar, PieChart, QueryStats, RestaurantMenu, Scale } from '@mui/icons-material';
import FeatureCard from '@components/landing-page/FeatureCard';

import classes from './style.module.scss';

const Features = ({ intl: { formatMessage } }) => (
  <div className={classes.featuresContainer} data-testid="features">
    <div className={classes.featuresTitle}>
      <FormattedMessage id="app_features" />
    </div>
    <div className={classes.features}>
      <FeatureCard
        icon={<PieChart />}
        title={formatMessage({ id: 'app_nutrition_tracking' })}
        subtitle={formatMessage({ id: 'app_nutrition_tracking_description' })}
      />
      <FeatureCard
        icon={<EditCalendar />}
        title={formatMessage({ id: 'app_meal_planning' })}
        subtitle={formatMessage({ id: 'app_meal_planning_description' })}
      />
      <FeatureCard
        icon={<Scale />}
        title={formatMessage({ id: 'app_weight_tracking' })}
        subtitle={formatMessage({ id: 'app_weight_tracking_description' })}
      />
      <FeatureCard
        icon={<RestaurantMenu />}
        title={formatMessage({ id: 'app_food_database' })}
        subtitle={formatMessage({ id: 'app_food_database_description' })}
      />
      <FeatureCard
        icon={<QueryStats />}
        title={formatMessage({ id: 'app_dashboard_analytics' })}
        subtitle={formatMessage({ id: 'app_dashboard_analytics_description' })}
      />
    </div>
  </div>
);

Features.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(Features);
