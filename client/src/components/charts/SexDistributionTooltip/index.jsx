import PropTypes from 'prop-types';

import classes from './style.module.scss';

const SexDistributionTooltip = ({ datum }) => (
  <div className={classes.tooltip}>
    <span style={{ color: datum?.color }}>{datum?.data?.id}:</span> {datum?.data?.quantity}
  </div>
);

SexDistributionTooltip.propTypes = {
  datum: PropTypes.object,
};

export default SexDistributionTooltip;
