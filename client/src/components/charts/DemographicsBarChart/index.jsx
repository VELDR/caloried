import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';

import classes from './style.module.scss';

const DemographicsBarChart = ({ data }) => {
  const theme = {
    text: {
      fontFamily: 'Poppins',
      fontSize: 18,
      fontWeight: 700,
    },
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
          fontSize: 13,
          fontWeight: 700,
          fill: 'var(--color-text-primary)',
        },
      },
    },
    legends: {
      text: {
        fontFamily: 'Poppins',
        fontSize: 11,
        fontWeight: 700,
        fill: 'var(--color-text-primary)',
      },
    },
  };

  const customTooltip = ({ id, value, indexValue }) => (
    <div className={classes.tooltip}>{`${id} (${indexValue}): ${value} users`}</div>
  );

  const maxUserCount = Math.max(...data.map((d) => Math.max(d.male, d.female)));

  const tickValues = Array.from({ length: maxUserCount + 1 }, (_, i) => i);

  return (
    <div className={classes.container}>
      <ResponsiveBar
        data={data}
        keys={['male', 'female']}
        indexBy="ageGroup"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={(bar) => (bar.id === 'male' ? '#38d3e1' : '#ee18ae')}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Age Group',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'User count',
          legendPosition: 'middle',
          legendOffset: -40,
          tickValues,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        theme={theme}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,

            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate
        motionStiffness={90}
        motionDamping={15}
        tooltip={customTooltip}
      />
    </div>
  );
};

DemographicsBarChart.propTypes = {
  data: PropTypes.array,
};

export default DemographicsBarChart;
