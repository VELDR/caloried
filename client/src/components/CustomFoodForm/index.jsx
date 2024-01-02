import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Controller, useForm } from 'react-hook-form';
import { Avatar, Dialog, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { AddPhotoAlternate, Info } from '@mui/icons-material';
import config from '@config/index';
import proteinIcon from '@static/images/protein.png';
import fatIcon from '@static/images/fat.png';
import carbsIcon from '@static/images/carbs.png';
import caloriesIcon from '@static/images/calories.svg';

import { deleteCustomFood, editCustomFood } from '@pages/MyFoods/actions';
import PrimaryButton from '@components/ui/PrimaryButton';
import SecondaryButton from '@components/ui/SecondaryButton';
import { createCustomFood, getFoods } from '@pages/FoodSearch/actions';

import classes from './style.module.scss';

const CustomFoodForm = ({
  open,
  onClose,
  token,
  intl: { formatMessage },
  query,
  page,
  size,
  selectedCategory,
  food,
}) => {
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const imageInputRef = useRef();
  const [image, setImage] = useState(food?.image);

  useEffect(() => {
    if (food) {
      Object.entries(food).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [food, setValue]);

  const handleImageClick = () => {
    imageInputRef?.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (food) {
      dispatch(
        editCustomFood(food?.id, formData, token, () => {
          onClose();
        })
      );
    } else {
      dispatch(
        createCustomFood(formData, token, () => {
          onClose();
          if (query && query !== '') {
            dispatch(getFoods(query, page, size, selectedCategory, token));
          }

          setImage(null);
          reset();
        })
      );
    }
  };

  const onDelete = () => {
    if (food) {
      dispatch(deleteCustomFood(food?.id, token));
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth data-testid="custom-food-modal">
      <DialogTitle>
        {food ? <FormattedMessage id="app_edit_food" /> : <FormattedMessage id="app_submit_food" />}
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.form__top}>
            <div className={classes.imageContainer}>
              <Avatar
                src={image?.startsWith('blob') ? image : `${config.api.base}${image}`}
                className={classes.image}
                onClick={handleImageClick}
              >
                <AddPhotoAlternate />
              </Avatar>
            </div>
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, ref } }) => (
                <input
                  ref={(e) => {
                    ref(e);
                    imageInputRef.current = e;
                  }}
                  type="file"
                  onChange={(e) => {
                    handleImageChange(e);
                    onChange(e.target.files[0]);
                  }}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              )}
            />

            <div className={classes.food}>
              <div className={classes.name}>
                <label htmlFor="name" className={classes.label}>
                  <FormattedMessage id="app_food_name" />
                  <input
                    id="name"
                    type="text"
                    className={`${errors.name ? classes.inputError : ''}`}
                    {...register('name', { required: formatMessage({ id: 'app_foodname_is_required' }) })}
                  />
                </label>
                {errors.name && <span className={classes.error}>{errors.name.message}</span>}
              </div>
              <div className={classes.serving}>
                <div className={classes.serving__size}>
                  <label htmlFor="servingSize" className={classes.label}>
                    <div className={classes.label__item}>
                      <FormattedMessage id="app_serving_size" />
                      <Tooltip title={formatMessage({ id: 'app_serving_size_tooltip' })}>
                        <Info />
                      </Tooltip>
                    </div>

                    <input
                      id="servingSize"
                      type="number"
                      className={`${errors.servingSize ? classes.inputError : ''}`}
                      {...register('servingSize', {
                        required: formatMessage({ id: 'app_required_field' }),
                        valueAsNumber: true,
                      })}
                    />
                  </label>
                  {errors.servingSize && <span className={classes.error}>{errors.servingSize.message}</span>}
                </div>
                <div className={classes.serving__unit}>
                  <label htmlFor="servingUnit" className={classes.label}>
                    <div className={classes.label__item}>
                      <FormattedMessage id="app_serving_unit" />
                      <Tooltip title={formatMessage({ id: 'app_serving_unit_tooltip' })}>
                        <Info />
                      </Tooltip>
                    </div>
                    <input
                      id="servingUnit"
                      type="text"
                      className={`${errors.servingUnit ? classes.inputError : ''}`}
                      {...register('servingUnit', { required: formatMessage({ id: 'app_required_field' }) })}
                    />
                  </label>
                  {errors.servingUnit && <span className={classes.error}>{errors.servingUnit.message}</span>}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.form__bottom}>
            <div className={classes.info}>
              <FormattedMessage id="app_nutrient_info" />
            </div>
            <div className={classes.calories}>
              <label htmlFor="calories" className={classes.label}>
                <FormattedMessage id="app_calories" />

                <div className={classes.inputContainer}>
                  <img src={caloriesIcon} alt="" />
                  <input
                    id="calories"
                    type="number"
                    className={`${errors.calories ? classes.inputError : ''}`}
                    {...register('calories', {
                      required: formatMessage({ id: 'app_calories_is_required' }),
                      valueAsNumber: true,
                    })}
                  />
                  <div className={classes.adornment}>kcal</div>
                </div>
              </label>
              {errors.calories && <span className={classes.error}>{errors.calories.message}</span>}
            </div>
            <div className={classes.macro}>
              <div className={classes.macro__nutrient}>
                <label htmlFor="protein" className={classes.label}>
                  <FormattedMessage id="app_protein" />
                  <img src={proteinIcon} alt="" />
                  <input
                    id="protein"
                    type="number"
                    className={`${errors.protein ? classes.inputError : ''}`}
                    {...register('protein', {
                      required: formatMessage({ id: 'app_protein_is_required' }),
                      valueAsNumber: true,
                    })}
                  />
                  <div className={classes.adornment}>g</div>
                </label>
                {errors.protein && <span className={classes.error}>{errors.protein.message}</span>}
              </div>
              <div className={classes.macro__nutrient}>
                <label htmlFor="carbs" className={classes.label}>
                  <img src={carbsIcon} alt="" />
                  <FormattedMessage id="app_carbs" />
                  <input
                    id="carbs"
                    type="number"
                    className={`${errors.carbs ? classes.inputError : ''}`}
                    {...register('carbs', {
                      required: formatMessage({ id: 'app_carbs_is_required' }),
                      valueAsNumber: true,
                    })}
                  />
                  <div className={classes.adornment}>g</div>
                </label>
                {errors.carbs && <span className={classes.error}>{errors.carbs.message}</span>}
              </div>
              <div className={classes.macro__nutrient}>
                <label htmlFor="fat" className={classes.label}>
                  <img src={fatIcon} alt="" />
                  <FormattedMessage id="app_fat" />
                  <input
                    id="fat"
                    type="number"
                    className={`${errors.fat ? classes.inputError : ''}`}
                    {...register('fat', {
                      required: formatMessage({ id: 'app_fat_is_required' }),
                      valueAsNumber: true,
                    })}
                  />
                  <div className={classes.adornment}>g</div>
                </label>
                {errors.fat && <span className={classes.error}>{errors.fat.message}</span>}
              </div>
            </div>
          </div>
          <div className={classes.buttons}>
            <SecondaryButton className={classes.button} onClick={onClose}>
              <FormattedMessage id="app_cancel" />
            </SecondaryButton>
            {food && (
              <PrimaryButton
                className={`${classes.button} ${classes.deleteButton}`}
                onClick={onDelete}
                isSubmit={false}
              >
                <div className={classes.text}>
                  <FormattedMessage id="app_delete" />
                </div>
              </PrimaryButton>
            )}
            <PrimaryButton className={classes.button}>
              <div className={classes.text}>
                {food ? <FormattedMessage id="app_save" /> : <FormattedMessage id="app_submit" />}
              </div>
            </PrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

CustomFoodForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  token: PropTypes.string,
  intl: PropTypes.object,
  query: PropTypes.string,
  page: PropTypes.number,
  size: PropTypes.number,
  selectedCategory: PropTypes.string,
  food: PropTypes.object,
};

export default injectIntl(CustomFoodForm);
