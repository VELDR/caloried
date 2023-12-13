import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import { DashboardRounded } from '@mui/icons-material';
import proteinIcon from '@static/images/protein.png';
import fatIcon from '@static/images/fat.png';
import carbsIcon from '@static/images/carbs.png';
import caloriesIcon from '@static/images/calories.svg';
import {
  calculateMacronutrientCalories,
  calculateNutrientPercentage,
  calculateTotalNutrients,
} from '@utils/calculateUtils';
import { COLORS } from '@constants';

import PieChart from '@components/charts/PieChart';
import MacronutrientTooltip from '@components/charts/MacronutrientTooltip';
import CaloriesLineChart from '@components/charts/CaloriesLineChart';
import ActivityCalendar from '@components/charts/ActivityCalendar';
import ProfileCard from '@components/profile/ProfileCard';
import { selectToken } from '@containers/Client/selectors';
import NutritionCard from '@components/NutritionCard';
import { selectMeals, selectUser } from '@pages/Diary/selectors';
import { getMealsByDate, getUser } from '@pages/Diary/actions';
import { selectActivity, selectConsumedCalories } from './selectors';
import { getUserActivity, getUserCaloriesConsumed } from './actions';

import classes from './style.module.scss';

const MONTHLY = 30;
const WEEKLY = 7;

const Dashboard = ({ user, activity, consumedCalories, meals, token, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [selectedTimeRange, setSelectedTimeRange] = useState(WEEKLY);
  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotalNutrients(meals);

  const handleFilterChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  const { proteinCalories, carbsCalories, fatCalories } = calculateMacronutrientCalories(
    totalProtein,
    totalCarbs,
    totalFat
  );

  const fatPercentage = calculateNutrientPercentage(fatCalories, totalCalories, 1);
  const proteinPercentage = calculateNutrientPercentage(proteinCalories, totalCalories, 1);
  const carbsPercentage = calculateNutrientPercentage(carbsCalories, totalCalories, 1);

  const totalPercentage = fatPercentage + proteinPercentage + carbsPercentage;

  const pieChartData = [
    { id: 'Fat', label: 'Fat', value: fatPercentage, grams: totalFat },
    { id: 'Protein', label: 'Protein', value: proteinPercentage, grams: totalProtein },
    { id: 'Carbohydrates', label: 'Carbohydrates', value: carbsPercentage, grams: totalCarbs },
  ];

  useEffect(() => {
    dispatch(getUserActivity(token));
    dispatch(getUserCaloriesConsumed(selectedTimeRange, token));
    dispatch(getUser(token));
    dispatch(getMealsByDate(today, token));
  }, [dispatch, selectedTimeRange, today, token]);

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <div className={classes.header}>
          <DashboardRounded /> <FormattedMessage id="app_dashboard" />
        </div>
        <div className={classes.top}>
          <ProfileCard user={user} />
          <div className={classes.pieChart}>
            <div className={classes.pieChart__title}>
              <FormattedMessage id="app_today_macronutrient_breakdown" />
            </div>
            <div className={classes.pieChart__wrapper}>
              {totalPercentage === 0 ? (
                <div className={classes.noDataMessage}>
                  <FormattedMessage id="app_no_macronutrients_message" />
                  <div className={classes.logButton} onClick={() => navigate('/search')}>
                    <FormattedMessage id="app_log_your_food" />
                  </div>
                </div>
              ) : (
                <PieChart data={pieChartData} colors={COLORS} tooltip={MacronutrientTooltip} />
              )}
            </div>
          </div>
        </div>
        <div className={classes.todayIntake}>
          <div className={classes.todayIntake__title}>
            <FormattedMessage id="app_today_intake" />
          </div>
          <div className={classes.nutrition}>
            <NutritionCard
              icon={caloriesIcon}
              value={totalCalories}
              label={formatMessage({ id: 'app_calories_consumed' })}
              unit="kcal"
            />
            <NutritionCard
              icon={proteinIcon}
              value={totalProtein}
              label={formatMessage({ id: 'app_protein_consumed' })}
              unit="g"
            />
            <NutritionCard
              icon={carbsIcon}
              value={totalCarbs}
              label={formatMessage({ id: 'app_carbs_consumed' })}
              unit="g"
            />
            <NutritionCard icon={fatIcon} value={totalFat} label={formatMessage({ id: 'app_fat_consumed' })} unit="g" />
          </div>
        </div>
        <div className={classes.lineChart}>
          <div className={classes.lineChart__header}>
            <div className={classes.title}>
              <FormattedMessage id="app_eating_patterns" />
            </div>
            <div className={classes.filter}>
              <div
                className={`${classes.filter__item} ${selectedTimeRange === WEEKLY ? classes.active : ''}`}
                onClick={() => handleFilterChange(WEEKLY)}
              >
                <FormattedMessage id="app_weekly" />
              </div>
              <div
                className={`${classes.filter__item} ${selectedTimeRange === MONTHLY ? classes.active : ''}`}
                onClick={() => handleFilterChange(MONTHLY)}
              >
                <FormattedMessage id="app_monthly" />
              </div>
            </div>
          </div>
          <div className={classes.lineChart__wrapper}>
            {consumedCalories && <CaloriesLineChart data={consumedCalories} />}
          </div>
        </div>

        <div className={classes.calendar}>
          <div className={classes.calendar__title}>
            <FormattedMessage id="app_my_activity" />
          </div>
          <div className={classes.calendar__wrapper}>{activity && <ActivityCalendar activity={activity} />}</div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  activity: PropTypes.array,
  token: PropTypes.string,
  consumedCalories: PropTypes.array,
  user: PropTypes.object,
  meals: PropTypes.array,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  activity: selectActivity,
  token: selectToken,
  consumedCalories: selectConsumedCalories,
  user: selectUser,
  meals: selectMeals,
});

export default injectIntl(connect(mapStateToProps)(Dashboard));
