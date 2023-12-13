import PropTypes from 'prop-types';

import classes from './style.module.scss';

const MacronutrientTooltip = ({ datum }) => (
  <div className={classes.tooltip}>
    <span style={{ color: datum?.color }}>{datum?.data?.id}:</span> {datum?.data?.grams} g
  </div>
);

MacronutrientTooltip.propTypes = {
  datum: PropTypes.object,
};

export default MacronutrientTooltip;
