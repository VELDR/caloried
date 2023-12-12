import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Dialog, DialogContent } from '@mui/material';
import { CalendarToday, Delete, Save } from '@mui/icons-material';
import proteinIcon from '@static/images/protein.png';
import fatIcon from '@static/images/fat.png';
import carbsIcon from '@static/images/carbs.png';
import caloriesIcon from '@static/images/calories.svg';

import { selectToken } from '@containers/Client/selectors';
import PieChart from '@components/charts/PieChart';
import PrimaryButton from '@components/ui/PrimaryButton';
import SecondaryButton from '@components/ui/SecondaryButton';
import { deleteFoodFromDiary, editFoodInDiary } from '@pages/Diary/actions';
import { calculateNutrientPercentage } from '@utils/calculateUtils';

import classes from './style.module.scss';

const EditFoodModal = ({
  open,
  onClose,
  foodDetails,
  initialQuantity,
  initialMealType,
  initialDate,
  foodLogId,
  token,
  intl: { formatMessage },
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const calories = foodDetails?.nutrients?.calories?.value;
  const carbsPercentage = calculateNutrientPercentage(foodDetails?.nutrients.carbs?.value, calories, 4);
  const proteinPercentage = calculateNutrientPercentage(foodDetails?.nutrients.protein?.value, calories, 4);
  const fatPercentage = calculateNutrientPercentage(foodDetails?.nutrients.fat?.value, calories, 9);

  const macronutrientData = [
    { id: 'Fat', label: 'Fat', value: fatPercentage, grams: foodDetails?.nutrients?.fat?.value },
    { id: 'Protein', label: 'Protein', value: proteinPercentage, grams: foodDetails?.nutrients?.protein?.value },
    {
      id: 'Carbohydrates',
      label: 'Carbohydrates',
      value: carbsPercentage,
      grams: foodDetails?.nutrients?.carbs?.value,
    },
  ];

  const onSave = (data) => {
    dispatch(editFoodInDiary(data, foodLogId, token, initialDate));
    onClose();
  };

  const onDelete = () => {
    dispatch(deleteFoodFromDiary(foodLogId, token));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent className={classes.dialog}>
        <div className={classes.dialog__header}>
          <img src={foodDetails?.image} alt={foodDetails?.foodName} className={classes.image} />
          <div className={classes.food}>
            <div className={classes.food__name}>{foodDetails?.foodName}</div>
            <div className={classes.food__serving}>
              {foodDetails?.servingQty} × {foodDetails?.servingWeight}g ({foodDetails?.servingQty}{' '}
              {foodDetails?.servingUnit})
            </div>
          </div>
        </div>
        <div className={classes.nutrition}>
          <div className={classes.pieChart}>
            <PieChart data={macronutrientData} />
          </div>
          <div className={classes.nutrient}>
            <div className={classes.nutrient__item}>
              <img src={caloriesIcon} alt="" className={classes.icon} />
              {foodDetails?.nutrients?.calories?.value}
            </div>
            <div className={classes.nutrient__item}>
              <img src={proteinIcon} alt="" className={classes.icon} />
              {foodDetails?.nutrients?.protein?.value}g
            </div>
            <div className={classes.nutrient__item}>
              <img src={carbsIcon} alt="" className={classes.icon} />
              {foodDetails?.nutrients?.carbs?.value}g
            </div>
            <div className={classes.nutrient__item}>
              <img src={fatIcon} alt="" className={classes.icon} />
              {foodDetails?.nutrients?.fat?.value}g
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSave)} className={classes.editForm}>
          <div className={classes.form}>
            <div className={classes.form__group}>
              <label htmlFor="quantity" className={classes.label}>
                <FormattedMessage id="app_number_of_serving" />
                <input
                  id="quantity"
                  type="number"
                  className={`${classes.input} ${classes.quantity}`}
                  {...register('quantity', { required: true, min: 1, max: 1000 })}
                  defaultValue={initialQuantity}
                />
              </label>
            </div>

            <div className={classes.form__group}>
              <label htmlFor="date" className={classes.label}>
                <FormattedMessage id="app_date" />
                <input
                  id="date"
                  type="date"
                  className={`${classes.input} ${classes.date}`}
                  {...register('date', { required: formatMessage({ id: 'app_date_required' }) })}
                  defaultValue={initialDate}
                />
                <CalendarToday className={classes.calendar} />
              </label>
            </div>
            {errors.date && <span className={classes.error}>{errors.date.message}</span>}
            <div className={classes.form__group}>
              <label htmlFor="mealType" className={classes.label}>
                <FormattedMessage id="app_meal_type" />
                <select
                  id="mealType"
                  className={classes.input}
                  {...register('mealType', { required: formatMessage({ id: 'app_meal_type_required' }) })}
                  defaultValue={initialMealType}
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
              {errors.mealType && <span className={classes.error}>{errors.mealType.message}</span>}
            </div>
          </div>
          <div className={classes.buttons}>
            <SecondaryButton className={classes.button} onClick={onClose}>
              <FormattedMessage id="app_cancel" />
            </SecondaryButton>
            <PrimaryButton className={`${classes.button} ${classes.deleteButton}`} onClick={onDelete} isSubmit={false}>
              <Delete />
              <div className={classes.text}>
                <FormattedMessage id="app_delete" />
              </div>
            </PrimaryButton>
            <PrimaryButton className={classes.button}>
              <Save />
              <div className={classes.text}>
                <FormattedMessage id="app_save" />
              </div>
            </PrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditFoodModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  foodDetails: PropTypes.object,
  initialQuantity: PropTypes.number,
  initialMealType: PropTypes.string,
  initialDate: PropTypes.string,
  foodLogId: PropTypes.number,
  token: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
});

export default injectIntl(connect(mapStateToProps)(EditFoodModal));
