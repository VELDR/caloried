import PropTypes from 'prop-types';

import classes from './style.module.scss';

const NutritionCard = ({ icon, value, label, unit }) => (
  <div className={classes.item} data-testid="nutrition-card">
    <img src={icon} alt="" className={classes.icon} data-testid="nutrition-card-icon" />
    <div className={classes.text}>
      <div className={classes.value} data-testid="nutrition-card-value">
        {value} <span>{unit}</span>
      </div>
      <div className={classes.label} data-testid="nutrition-card-label">
        {label}
      </div>
    </div>
  </div>
);

NutritionCard.propTypes = {
  icon: PropTypes.string,
  value: PropTypes.number,
  label: PropTypes.string,
  unit: PropTypes.string,
};

export default NutritionCard;
