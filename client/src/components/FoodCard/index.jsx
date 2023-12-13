import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tooltip } from '@mui/material';
import proteinIcon from '@static/images/protein.png';
import fatIcon from '@static/images/fat.png';
import carbsIcon from '@static/images/carbs.png';
import caloriesIcon from '@static/images/calories.svg';

import { ChevronRight } from '@mui/icons-material';

import classes from './style.module.scss';

const FoodCard = ({ food, onClick, intl: { formatMessage } }) => (
  <div className={classes.container} onClick={onClick}>
    <div className={classes.food}>
      <div className={classes.imageWrap}>
        <img src={food?.image} alt={food?.foodName} className={classes.image} />
        <span
          className={
            food?.type === 'common' ? `${classes.type} ${classes.common}` : `${classes.type} ${classes.branded}`
          }
        >
          {food?.type}
        </span>
      </div>
      <div className={classes.food__content}>
        <Tooltip title={food?.foodName}>
          <div className={classes.name}>{food?.foodName}</div>
        </Tooltip>
        <div className={classes.serving}>
          <Tooltip title={`${food?.servingQty} ${food?.servingUnit} `}>
            <span className={classes.serving__unit}>
              {food?.servingQty} {food?.servingUnit}
            </span>
          </Tooltip>
          {food?.servingWeight && <span className={classes.serving__weight}>• {food?.servingWeight} g</span>}
        </div>
        <div className={classes.nutrient}>
          <div className={classes.nutrient__item}>
            <img src={caloriesIcon} alt="" className={classes.icon} />
            {food?.nutrients?.calories?.value}
          </div>
          <div className={classes.nutrient__item}>
            <img src={proteinIcon} alt="" className={classes.icon} />
            {food?.nutrients?.protein?.value}
          </div>
          <div className={classes.nutrient__item}>
            <img src={carbsIcon} alt="" className={classes.icon} />
            {food?.nutrients?.carbs?.value}
          </div>
          <div className={classes.nutrient__item}>
            <img src={fatIcon} alt="" className={classes.icon} />
            {food?.nutrients?.fat?.value}
          </div>
        </div>
      </div>
    </div>

    <div className={classes.right}>
      <div className={classes.nutrientBig}>
        <Tooltip title={formatMessage({ id: 'app_protein' })}>
          <div className={classes.nutrientBig__item}>
            <img src={proteinIcon} alt="" className={classes.icon} />
            {food?.nutrients?.protein?.value} g
          </div>
        </Tooltip>
        <Tooltip title={formatMessage({ id: 'app_carbs' })}>
          <div className={classes.nutrientBig__item}>
            <img src={carbsIcon} alt="" className={classes.icon} />
            {food?.nutrients?.carbs?.value} g
          </div>
        </Tooltip>
        <Tooltip title={formatMessage({ id: 'app_fat' })}>
          <div className={classes.nutrientBig__item}>
            <img src={fatIcon} alt="" className={classes.icon} />
            {food?.nutrients?.fat?.value} g
          </div>
        </Tooltip>
      </div>
      <div className={classes.leftMost}>
        <div className={classes.calories}>
          <span className={classes.calories__value}>{food?.nutrients?.calories?.value}</span> kcal
        </div>
        <ChevronRight className={classes.chevronRight} />
      </div>
    </div>
  </div>
);

FoodCard.propTypes = {
  food: PropTypes.object,
  onClick: PropTypes.func,
  intl: PropTypes.object,
};

export default injectIntl(FoodCard);
