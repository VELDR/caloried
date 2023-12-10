import PropTypes from 'prop-types';
import { arc as d3Arc } from 'd3-shape';

import classes from './style.module.scss';

const CustomArcLabel = ({ datum, label, style }) => {
  const arcGenerator = d3Arc()
    .innerRadius(datum.arc.innerRadius)
    .outerRadius(datum.arc.outerRadius)
    .startAngle(datum.arc.startAngle)
    .endAngle(datum.arc.endAngle);

  const centroid = arcGenerator.centroid();

  const [x, y] = centroid.map((coord) => coord * 1.4);

  return (
    <text fill={style.textColor} className={classes.text} textAnchor="middle" dominantBaseline="central" x={x} y={y}>
      {label}
    </text>
  );
};

CustomArcLabel.propTypes = {
  datum: PropTypes.object,
  label: PropTypes.string,
  style: PropTypes.object,
};

export default CustomArcLabel;
