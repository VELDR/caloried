import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useForm } from 'react-hook-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Tooltip } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import proteinIcon from '@static/images/protein.png';
import fatIcon from '@static/images/fat.png';
import carbsIcon from '@static/images/carbs.png';
import caloriesIcon from '@static/images/calories.svg';

import { calculateAdjustedNutrients, calculateNutrientPercentage } from '@utils/calculateUtils';
import { useServingForm } from '@utils/hookHelper';
import { formatDate } from '@utils/formatUtils';
import NutritionTable from '@components/NutritionTable';
import PieChart from '@components/charts/PieChart';
import PrimaryButton from '@components/ui/PrimaryButton';
import MacronutrientTooltip from '@components/charts/MacronutrientTooltip';
import { COLORS } from '@constants';

import { selectToken } from '@containers/Client/selectors';
import { selectSelectedDate, selectSelectedMealType } from '@pages/Diary/selectors';
import { addFoodToDiary, getFoodDetails } from './actions';
import { selectFoodDetails } from './selectors';

import classes from './style.module.scss';

const FoodDetails = ({ foodDetails, token, selectedMealType, selectedDate, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const { foodType, foodName } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    servingCount,
    setServingCount,
    selectedServingSize,
    selectedServingUnit,
    selectedServingQty,
    handleServingSizeChange,
    handleServingCountChange,
  } = useServingForm(foodDetails);

  const [macronutrientData, setMacronutrientData] = useState([]);

  const isCommonFood = foodType === 'common';
  const altMeasures = foodDetails?.altMeasures || [];

  useEffect(() => {
    dispatch(getFoodDetails(foodType, foodName, token));
  }, [dispatch, foodName, foodType, token]);

  const adjustedNutrients = calculateAdjustedNutrients(foodDetails, selectedServingSize, servingCount);

  useEffect(() => {
    if (foodDetails) {
      const totalCalories = adjustedNutrients?.calories?.value;
      const carbsPercentage = calculateNutrientPercentage(adjustedNutrients.carbs.value, totalCalories, 4);
      const proteinPercentage = calculateNutrientPercentage(adjustedNutrients.protein.value, totalCalories, 4);
      const fatPercentage = calculateNutrientPercentage(adjustedNutrients.fat.value, totalCalories, 9);

      setMacronutrientData([
        {
          id: 'Fat',
          label: formatMessage({ id: 'app_fat' }),
          value: fatPercentage,
          grams: adjustedNutrients?.fat?.value,
        },
        {
          id: 'Protein',
          label: formatMessage({ id: 'app_protein' }),
          value: proteinPercentage,
          grams: adjustedNutrients?.protein?.value,
        },
        {
          id: 'Carbohydrates',
          label: formatMessage({ id: 'app_carbohydrate' }),
          value: carbsPercentage,
          grams: adjustedNutrients?.carbs?.value,
        },
      ]);
    }
  }, [
    servingCount,
    selectedServingSize,
    foodDetails,
    adjustedNutrients?.calories?.value,
    adjustedNutrients?.carbs?.value,
    adjustedNutrients?.protein?.value,
    adjustedNutrients?.fat?.value,
  ]);

  const onSubmit = (data) => {
    const foodData = {
      ...data,
      name: foodDetails?.foodName,
      image: foodDetails?.image,
      calories: foodDetails?.nutrients?.calories?.value,
      fat: foodDetails?.nutrients?.fat?.value,
      protein: foodDetails?.nutrients?.protein?.value,
      carbs: foodDetails?.nutrients?.carbs?.value,
      servingUnit: selectedServingUnit,
    };
    dispatch(addFoodToDiary(foodData, token));
  };

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.header__left}>
            <img src={foodDetails?.image} alt={foodDetails?.foodName} />
            <div className={classes.details}>
              <div className={classes.foodName}>{foodDetails?.foodName}</div>
              <div className={classes.brand}>{foodDetails?.brandName}</div>
              <div className={classes.serving}>
                {servingCount} × {selectedServingSize || foodDetails?.servingWeight}g (
                {selectedServingQty || foodDetails?.servingQty} {selectedServingUnit || foodDetails?.servingUnit})
              </div>
            </div>
          </div>

          <div
            className={
              foodType === 'common' ? `${classes.type} ${classes.common}` : `${classes.type} ${classes.branded}`
            }
          >
            {foodType}
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.details}>
            <div className={classes.details__title}>
              <FormattedMessage id="app_track_your_intake" />
            </div>

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
                      // TODO: Fix this weird bug
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
            <div className={classes.nutrition}>
              <div className={classes.calories}>
                <img src={caloriesIcon} alt="fire" />
                <span>{adjustedNutrients?.calories?.value}</span> kcal
              </div>

              <div className={classes.nutrientBig}>
                <Tooltip title={formatMessage({ id: 'app_protein' })}>
                  <div className={classes.nutrientBig__item}>
                    <img src={proteinIcon} alt="protein" className={classes.icon} />
                    {adjustedNutrients?.protein?.value} g
                  </div>
                </Tooltip>
                <Tooltip title={formatMessage({ id: 'app_carbs' })}>
                  <div className={classes.nutrientBig__item}>
                    <img src={carbsIcon} alt="carbohydrate" className={classes.icon} />
                    {adjustedNutrients?.carbs?.value} g
                  </div>
                </Tooltip>
                <Tooltip title={formatMessage({ id: 'app_fat' })}>
                  <div className={classes.nutrientBig__item}>
                    <img src={fatIcon} alt="fat" className={classes.icon} />
                    {adjustedNutrients?.fat?.value} g
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className={classes.pieChart}>
            <div className={classes.pieChart__title}>
              <FormattedMessage id="app_nutrition_distribution" />
            </div>
            <div className={classes.pieChart__description}>
              <FormattedMessage id="app_this_pie_shows" />
              <span>{foodDetails?.foodName}</span>.
            </div>
            <div className={classes.pieChart__chart}>
              <PieChart data={macronutrientData} colors={COLORS} tooltip={MacronutrientTooltip} />
            </div>
          </div>
        </div>
      </div>
      <NutritionTable
        foodDetails={foodDetails}
        servingCount={servingCount}
        setServingCount={setServingCount}
        selectedServingSize={selectedServingSize}
        selectedServingUnit={selectedServingUnit}
        selectedServingQty={selectedServingQty}
      />
    </div>
  );
};

FoodDetails.propTypes = {
  foodDetails: PropTypes.object,
  token: PropTypes.string,
  selectedMealType: PropTypes.string,
  selectedDate: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  foodDetails: selectFoodDetails,
  token: selectToken,
  selectedMealType: selectSelectedMealType,
  selectedDate: selectSelectedDate,
});

export default injectIntl(connect(mapStateToProps)(FoodDetails));
