import PropTypes from 'prop-types';

import classes from './style.module.scss';

const PieChartTooltip = ({ datum }) => (
  <div className={classes.tooltip}>
    <span style={{ color: datum?.color }}>{datum?.data?.id}:</span> {datum?.data?.grams} g
  </div>
);

PieChartTooltip.propTypes = {
  datum: PropTypes.object,
};

export default PieChartTooltip;
