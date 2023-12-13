import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { setMealType } from '@pages/Diary/actions';
import FoodCard from '@components/FoodCard';
import EditFoodModal from '@components/diary/EditFoodModal';
import { FormattedMessage, injectIntl } from 'react-intl';

import classes from './style.module.scss';

const MealCard = ({ meal, mealType, intl: { formatMessage } }) => {
  const navigate = useNavigate('');
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [foodLogId, setFoodLogId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatFoodData = (foodLog) => {
    const updatedCalories = Math.round(foodLog.food.calories * foodLog.quantity);
    const updatedProtein = Math.round(foodLog.food.protein * foodLog.quantity);
    const updatedCarbs = Math.round(foodLog.food.carbs * foodLog.quantity);
    const updatedFat = parseFloat((foodLog.food.fat * foodLog.quantity).toFixed(1));

    return {
      foodName: foodLog.food.name,
      image: foodLog.food.image,
      servingQty: foodLog.quantity,
      servingUnit: foodLog.food.servingUnit,
      servingWeight: foodLog.food.servingSize * foodLog.quantity,
      nutrients: {
        calories: { value: updatedCalories },
        protein: { value: updatedProtein },
        carbs: { value: updatedCarbs },
        fat: { value: updatedFat },
      },
    };
  };

  const handleAddClick = () => {
    dispatch(setMealType(mealType));
    navigate('/search');
  };

  const handleCardClick = (foodLog) => {
    setSelectedFood(formatFoodData(foodLog));
    setOpenModal(true);
    setFoodLogId(foodLog.id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.left}>
          <Tooltip title={formatMessage({ id: 'app_add_food' })} onClick={handleAddClick}>
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
            meal.foodLogs.map((foodLog) => (
              <FoodCard key={foodLog.id} food={formatFoodData(foodLog)} onClick={() => handleCardClick(foodLog)} />
            ))
          ) : (
            <div className={classes.noFood}>
              🍽️
              <FormattedMessage id="app_no_foods_yet" />{' '}
              <div className={classes.searchIcon} onClick={() => navigate('/search')}>
                🔍
              </div>
            </div>
          )}
        </div>
      )}
      <EditFoodModal
        open={openModal}
        onClose={handleCloseModal}
        foodDetails={selectedFood}
        initialQuantity={selectedFood?.servingQty}
        initialMealType={mealType}
        initialDate={meal.date}
        foodLogId={foodLogId}
      />
    </div>
  );
};

MealCard.propTypes = {
  meal: PropTypes.object,
  mealType: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(MealCard);
