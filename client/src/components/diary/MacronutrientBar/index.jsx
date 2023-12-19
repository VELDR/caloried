import PropTypes from 'prop-types';
import { useState } from 'react';
import classes from './style.module.scss';

const MacronutrientBar = ({ type, value, dailyGoal }) => {
  const [isHovering, setIsHovering] = useState(false);
  const percentage = dailyGoal ? (value / dailyGoal) * 100 : 0;

  return (
    <div
      className={classes.progressBarContainer}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-testid="macronutrient-bar"
    >
      <div className={classes.wrapper}>
        <span className={classes.micronutrient}>{type}</span>
        <div className={classes.progress}>
          <div className={`${classes.progressBar} ${classes[type]}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
      <div className={classes.percentage}>{isHovering ? `${value}/${dailyGoal} g` : `${percentage.toFixed(0)}%`}</div>
    </div>
  );
};

MacronutrientBar.propTypes = {
  type: PropTypes.string,
  value: PropTypes.number,
  dailyGoal: PropTypes.number,
};
export default MacronutrientBar;
