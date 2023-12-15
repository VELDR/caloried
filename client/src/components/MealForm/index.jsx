import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import PrimaryButton from '@components/ui/PrimaryButton';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addFoodToDiary } from '@pages/FoodDetails/actions';
import { formatDate } from '@utils/formatUtils';
import { CalendarToday } from '@mui/icons-material';
import classes from './style.module.scss';

const MealForm = ({
  foodDetails,
  token,
  foodType,
  selectedServingUnit,
  servingCount,
  handleServingCountChange,
  handleServingSizeChange,
  selectedServingSize,
  selectedDate,
  selectedMealType,
  getNutrientValue,
}) => {
  const dispatch = useDispatch();
  const isCommonFood = foodType === 'common';
  const altMeasures = foodDetails?.altMeasures || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { nutrients } = foodDetails || {};

  const onSubmit = (data) => {
    const foodData = {
      ...data,
      name: foodDetails?.foodName,
      image: foodDetails?.image,
      calories: getNutrientValue(nutrients?.calories),
      fat: getNutrientValue(nutrients?.fat),
      protein: getNutrientValue(nutrients?.protein),
      carbs: getNutrientValue(nutrients?.carbs),
      servingUnit: selectedServingUnit,
    };

    dispatch(addFoodToDiary(foodData, token));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.formContainer}>
      <div className={classes.form}>
        <div className={classes.form__group}>
          <label htmlFor="quantity" className={classes.label}>
            <FormattedMessage id="app_number_of_serving" />
            <input
              id="quantity"
              type="number"
              className={`${classes.input} ${classes.quantity}`}
              {...register('quantity', { required: true, min: 1, max: 1000 })}
              value={servingCount}
              onChange={handleServingCountChange}
            />
          </label>
        </div>
        {errors.quantity && (
          <span className={classes.error}>
            <FormattedMessage id="app_serving_is_required" />
          </span>
        )}
        <div className={classes.form__group}>
          <label htmlFor="servingSize" className={classes.label}>
            <FormattedMessage id="app_serving_size" />
            <select
              id="servingSize"
              className={classes.input}
              {...register('servingSize', { required: true })}
              onChange={handleServingSizeChange}
              value={selectedServingSize}
            >
              {isCommonFood ? (
                altMeasures.map((measure, index) => (
                  <option key={index} value={measure.serving_weight}>
                    {measure.qty} {measure.measure} ({measure.serving_weight}g)
                  </option>
                ))
              ) : (
                <option value={foodDetails?.servingWeight}>
                  {foodDetails?.servingQty} {foodDetails?.servingUnit} ({foodDetails?.servingWeight}g)
                </option>
              )}
            </select>
          </label>
        </div>

        <div className={classes.form__group}>
          <label htmlFor="date" className={classes.label}>
            <FormattedMessage id="app_date" />
            <input
              id="date"
              type="date"
              className={`${classes.input} ${classes.date}`}
              {...register('date', { required: true })}
              defaultValue={selectedDate ? formatDate(selectedDate) : formatDate(new Date())}
            />
            <CalendarToday className={classes.calendar} />
          </label>
        </div>
        {errors.date && (
          <span className={classes.error}>
            <FormattedMessage id="app_date_is_required" />
          </span>
        )}
        <div className={classes.form__group}>
          <label htmlFor="mealType" className={classes.label}>
            <FormattedMessage id="app_meal_type" />
            <select
              id="mealType"
              className={classes.input}
              {...register('mealType', { required: true })}
              defaultValue={selectedMealType || 'Breakfast'}
            >
              <option value="Breakfast">
                <FormattedMessage id="app_breakfast" />
              </option>
              <option value="Lunch">
                <FormattedMessage id="app_lunch" />
              </option>
              <option value="Dinner">
                <FormattedMessage id="app_dinner" />
              </option>
              <option value="Snack">
                <FormattedMessage id="app_snack" />
              </option>
            </select>
          </label>
        </div>
      </div>
      <PrimaryButton className={classes.form__button}>
        <FormattedMessage id="app_add_to_diary" />
      </PrimaryButton>
    </form>
  );
};

MealForm.propTypes = {
  foodDetails: PropTypes.object,
  token: PropTypes.string,
  foodType: PropTypes.string,
  selectedServingUnit: PropTypes.string,
  servingCount: PropTypes.number,
  handleServingCountChange: PropTypes.func,
  handleServingSizeChange: PropTypes.func,
  selectedServingSize: PropTypes.number,
  selectedDate: PropTypes.string,
  selectedMealType: PropTypes.string,
  getNutrientValue: PropTypes.func,
};

export default MealForm;
