import PropTypes from 'prop-types';

import classes from './style.module.scss';

const NutritionCard = ({ icon, value, label, unit }) => (
  <div className={classes.item}>
    <img src={icon} alt="" className={classes.icon} />
    <div className={classes.text}>
      <div className={classes.value}>
        {value} <span>{unit}</span>
      </div>
      <div className={classes.label}>{label}</div>
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
