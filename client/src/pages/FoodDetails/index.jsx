import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { FormattedMessage, injectIntl } from 'react-intl';
import { Skeleton, Tooltip } from '@mui/material';

import proteinIcon from '@static/images/protein.png';
import fatIcon from '@static/images/fat.png';
import carbsIcon from '@static/images/carbs.png';
import caloriesIcon from '@static/images/calories.svg';

import { calculateAdjustedNutrients, calculateNutrientPercentage } from '@utils/calculateUtils';
import { useServingForm } from '@utils/hookHelper';
import NutritionTable from '@components/NutritionTable';
import PieChart from '@components/charts/PieChart';
import MacronutrientTooltip from '@components/charts/MacronutrientTooltip';
import { COLORS } from '@constants';

import { selectToken } from '@containers/Client/selectors';
import { selectLoading } from '@containers/App/selectors';
import MealForm from '@components/MealForm';
import { selectSelectedDate, selectSelectedMealType } from '@pages/Diary/selectors';
import { getFoodDetails } from './actions';
import { selectFoodDetails } from './selectors';

import classes from './style.module.scss';

const FoodDetails = ({ foodDetails, token, selectedMealType, selectedDate, intl: { formatMessage }, loading }) => {
  const dispatch = useDispatch();
  const { foodType, foodName } = useParams();
  const {
    servingCount,
    setServingCount,
    selectedServingSize,
    selectedServingUnit,
    selectedServingQty,
    handleServingSizeChange,
    handleServingCountChange,
  } = useServingForm(foodDetails);

  useEffect(() => {
    dispatch(getFoodDetails(foodType, foodName, token));
  }, [dispatch, foodName, foodType, token]);

  const adjustedNutrients = calculateAdjustedNutrients(foodDetails, selectedServingSize, servingCount);

  const macronutrientData = useMemo(() => {
    if (!foodDetails) return [];

    const totalCalories = adjustedNutrients?.calories?.value;
    const carbsPercentage = calculateNutrientPercentage(adjustedNutrients.carbs.value, totalCalories, 4);
    const proteinPercentage = calculateNutrientPercentage(adjustedNutrients.protein.value, totalCalories, 4);
    const fatPercentage = calculateNutrientPercentage(adjustedNutrients.fat.value, totalCalories, 9);

    return [
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
    ];
  }, [adjustedNutrients, foodDetails, formatMessage]);

  const { nutrients, servingWeight } = foodDetails || {};

  const roundValue = (value) => Math.round(value * 10) / 10;

  let nutrientFactor;
  if (servingWeight) {
    nutrientFactor = (selectedServingSize / servingWeight) * servingCount;
  } else {
    nutrientFactor = servingCount;
  }

  const getNutrientValue = (nutrient) => (nutrient?.value ? roundValue(nutrient.value * nutrientFactor) : 0);

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        {loading ? (
          <Skeleton className={classes.skeletonHeader} variant="rounded" animation="wave" />
        ) : (
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
        )}
        {loading ? (
          <Skeleton variant="rounded" className={classes.skeletonBody} animation="wave" />
        ) : (
          <div className={classes.body}>
            <div className={classes.details}>
              <div className={classes.details__title}>
                <FormattedMessage id="app_track_your_intake" />
              </div>

              <MealForm
                foodDetails={foodDetails}
                foodType={foodType}
                handleServingCountChange={handleServingCountChange}
                handleServingSizeChange={handleServingSizeChange}
                selectedDate={selectedDate}
                selectedMealType={selectedMealType}
                selectedServingSize={selectedServingSize}
                selectedServingUnit={selectedServingUnit}
                servingCount={servingCount}
                token={token}
                getNutrientValue={getNutrientValue}
              />

              <div className={classes.nutrition}>
                <div className={classes.calories}>
                  <img src={caloriesIcon} alt="fire" />
                  <span>{getNutrientValue(nutrients?.calories)}</span> kcal
                </div>

                <div className={classes.nutrientBig}>
                  <Tooltip title={formatMessage({ id: 'app_protein' })}>
                    <div className={classes.nutrientBig__item}>
                      <img src={proteinIcon} alt="protein" className={classes.icon} />
                      {getNutrientValue(nutrients?.protein)} g
                    </div>
                  </Tooltip>
                  <Tooltip title={formatMessage({ id: 'app_carbs' })}>
                    <div className={classes.nutrientBig__item}>
                      <img src={carbsIcon} alt="carbohydrate" className={classes.icon} />
                      {getNutrientValue(nutrients?.carbs)} g
                    </div>
                  </Tooltip>
                  <Tooltip title={formatMessage({ id: 'app_fat' })}>
                    <div className={classes.nutrientBig__item}>
                      <img src={fatIcon} alt="fat" className={classes.icon} />
                      {getNutrientValue(nutrients?.fat)} g
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
        )}
      </div>

      {loading ? (
        <Skeleton variant="rounded" className={classes.skeletonTable} animation="wave" />
      ) : (
        <NutritionTable
          foodDetails={foodDetails}
          servingCount={servingCount}
          setServingCount={setServingCount}
          selectedServingSize={selectedServingSize}
          selectedServingUnit={selectedServingUnit}
          selectedServingQty={selectedServingQty}
        />
      )}
    </div>
  );
};

FoodDetails.propTypes = {
  foodDetails: PropTypes.object,
  token: PropTypes.string,
  selectedMealType: PropTypes.string,
  selectedDate: PropTypes.string,
  intl: PropTypes.object,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  foodDetails: selectFoodDetails,
  token: selectToken,
  selectedMealType: selectSelectedMealType,
  selectedDate: selectSelectedDate,
  loading: selectLoading,
});

export default injectIntl(connect(mapStateToProps)(FoodDetails));
