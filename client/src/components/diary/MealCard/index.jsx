import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { setMealType } from '@pages/Diary/actions';
import FoodCard from '@components/FoodCard';

import classes from './style.module.scss';

const MealCard = ({ meal, mealType }) => {
  const navigate = useNavigate('');
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatFoodData = (foodLog) => ({
    foodName: foodLog.food.name,
    image: foodLog.food.image,
    servingQty: foodLog.quantity,
    servingUnit: foodLog.food.servingUnit,
    servingWeight: foodLog.food.servingSize,
    nutrients: {
      calories: { value: foodLog.food.calories },
      protein: { value: foodLog.food.protein },
      carbs: { value: foodLog.food.carbs },
      fat: { value: foodLog.food.fat },
    },
  });

  const handleAddClick = () => {
    dispatch(setMealType(mealType));
    navigate('/search');
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.left}>
          <Tooltip title="Add food" onClick={handleAddClick}>
            <Add />
          </Tooltip>
          <div className={classes.title}>{mealType}</div>
        </div>
        <div className={classes.right} onClick={toggleCollapse}>
          {isCollapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
        </div>
      </div>
      {!isCollapsed && (
        <div className={classes.body}>
          {meal.foodLogs.length > 0 ? (
            meal.foodLogs.map((foodLog) => <FoodCard key={foodLog.id} food={formatFoodData(foodLog)} />)
          ) : (
            <div className={classes.noFood}>
              🍽️No foods added yet!{' '}
              <div className={classes.searchIcon} onClick={() => navigate('/search')}>
                🔍
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

MealCard.propTypes = {
  meal: PropTypes.object,
  mealType: PropTypes.string,
};

export default MealCard;
