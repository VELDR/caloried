import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';
import { formatLineChartLabel } from '@utils/formatUtils';

import classes from './style.module.scss';

const WeightLineChart = ({ data }) => {
  const formattedData = [
    {
      id: 'weight',
      data: formatLineChartLabel(data),
    },
  ];
  const theme = {
    axis: {
      ticks: {
        text: {
          fontFamily: 'Poppins',
          fontSize: 11,
          fontWeight: 500,
          fill: 'var(--color-text-primary)',
        },
      },
      legend: {
        text: {
          fontFamily: 'Poppins',
          fontSize: 11,
          fontWeight: 700,
          fill: 'var(--color-text-primary)',
        },
      },
    },
  };

  const maxWeight = Math.max(...data.map((d) => d.y));

  const yMax = maxWeight + 10;

  const tickIncrement = 5;

  const tickValues = Array.from({ length: yMax / tickIncrement + 1 }, (_, i) => i * tickIncrement);

  const lineChartToolTip = (point) => (
    <div className={classes.tooltip}>
      <div className={classes.tooltip__text}>{point.data.y} kg</div>
    </div>
  );

  return (
    <div className={classes.container}>
      <ResponsiveLine
        data={formattedData}
        margin={{ top: 40, right: 30, bottom: 50, left: 60 }}
        // curve="monotoneX"
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: yMax,
          stacked: true,
          reverse: false,
        }}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Days',
          legendOffset: 40,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 25,
          tickRotation: 0,
          legend: 'Weight (kg)',
          legendOffset: -50,
          legendPosition: 'middle',
          tickValues,
        }}
        theme={theme}
        colors="var(--color-accent)"
        pointSize={8}
        useMesh
        pointBorderWidth={4}
        tooltip={({ point }) => lineChartToolTip(point)}
      />
    </div>
  );
};

WeightLineChart.propTypes = {
  data: PropTypes.array,
};

export default WeightLineChart;
