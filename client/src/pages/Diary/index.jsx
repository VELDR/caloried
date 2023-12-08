import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';

import { calculateTotalNutrients } from '@utils/foodUtils';
import { formatDate } from '@utils/formatUtils';
import { selectFirstLogin, selectToken } from '@containers/Client/selectors';
import { setFirstLogin } from '@containers/Client/actions';
import NutritionPopup from '@components/ui/NutritionPopup';
import MealCard from '@components/diary/MealCard';
import DiaryDate from '@components/diary/DiaryDate';
import CalorieCounter from '@components/diary/CalorieCounter';
import MacronutrientBar from '@components/diary/MacronutrientBar';

import { getMealsByDate, getUser, resetSelection } from './actions';
import { selectMeals, selectUser } from './selectors';

import classes from './style.module.scss';

const Diary = ({ firstLogin, token, user, meals }) => {
  const dispatch = useDispatch();
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNutritionPopup, setShowNutritionPopup] = useState(false);

  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotalNutrients(meals);
  const dailyCalorieGoal = user?.bmr;

  useEffect(() => {
    if (firstLogin) {
      setShowNutritionPopup(true);
      dispatch(setFirstLogin(false));
    }
    dispatch(getUser(token));
    dispatch(resetSelection());
  }, [firstLogin, dispatch, token]);

  useEffect(() => {
    dispatch(getMealsByDate(formatDate(currentDate), token));
  }, [currentDate, dispatch, token]);

  const handleClosePopup = () => {
    setShowNutritionPopup(false);
  };

  const renderMealCards = (mealType) => {
    const mealsForType = meals?.filter((meal) => meal.mealType === mealType);

    if (mealsForType && mealsForType.length > 0) {
      return mealsForType.map((meal) => <MealCard key={meal.id} meal={meal} mealType={mealType} />);
    }

    return <MealCard key={mealType} meal={{ mealType, foodLogs: [] }} mealType={mealType} />;
  };
  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <DiaryDate currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <div className={classes.nutrients}>
          <CalorieCounter caloriesConsumed={totalCalories} dailyCalorieGoal={dailyCalorieGoal} />
          <div className={classes.nutrients__macro}>
            <MacronutrientBar type="protein" value={totalProtein} dailyGoal={user?.proteinIntake} />
            <MacronutrientBar type="carbs" value={totalCarbs} dailyGoal={user?.carbsIntake} />
            <MacronutrientBar type="fat" value={totalFat} dailyGoal={user?.fatIntake} />
          </div>
        </div>

        <div className={classes.meals}>{mealTypes.map((mealType) => renderMealCards(mealType))}</div>
        <NutritionPopup open={showNutritionPopup} onClose={handleClosePopup} user={user} />
      </div>
    </div>
  );
};
Diary.propTypes = {
  firstLogin: PropTypes.bool,
  token: PropTypes.string,
  user: PropTypes.object,
  meals: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  firstLogin: selectFirstLogin,
  token: selectToken,
  user: selectUser,
  meals: selectMeals,
});

export default connect(mapStateToProps)(Diary);
