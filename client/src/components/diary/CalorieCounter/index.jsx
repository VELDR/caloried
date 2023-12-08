import PropTypes from 'prop-types';
import { useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import caloriesIcon from '@static/images/calories.svg';

import classes from './style.module.scss';

const CalorieCounter = ({ caloriesConsumed, dailyCalorieGoal }) => {
  const [isHovered, setIsHovered] = useState(false);

  const remainingCalories = dailyCalorieGoal - caloriesConsumed;
  const percentage = (caloriesConsumed / dailyCalorieGoal) * 100;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className={classes.container} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <CircularProgressbarWithChildren
        value={percentage}
        circleRatio={0.75}
        styles={buildStyles({
          rotation: 1 / 2 + 1 / 8,
          strokeLinecap: 'butt',
          pathTransitionDuration: 0.5,
          pathColor: `var(--color-primary)`,
          trailColor: 'var(--color-bg-secondary)',
          backgroundColor: 'var(--color-bg-primary)',
        })}
      >
        {isHovered ? (
          <div className={classes.content}>
            <img src={caloriesIcon} alt="" className={classes.icon} />
            <div className={classes.hovered}>
              {caloriesConsumed}/{dailyCalorieGoal}
            </div>
          </div>
        ) : (
          <div className={classes.content}>
            <div className={classes.title}>
              {remainingCalories}
              <span>kcal</span>
            </div>
            <div className={classes.subtitle}>Remaining</div>
          </div>
        )}
      </CircularProgressbarWithChildren>
    </div>
  );
};

CalorieCounter.propTypes = {
  caloriesConsumed: PropTypes.number,
  dailyCalorieGoal: PropTypes.number,
};

export default CalorieCounter;
