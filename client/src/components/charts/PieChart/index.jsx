import PropTypes from 'prop-types';
import { ResponsivePie } from '@nivo/pie';
import PieChartTooltip from '../PieChartTooltip';
import CustomArcLabel from '../CustomArcLabel';

import classes from './style.module.scss';

const COLORS = {
  Fat: '#FFE07D',
  Protein: '#CC3366',
  Carbohydrates: '#99CC66',
};

const PieChart = ({ data }) => {
  const percentFormat = (value) => `${Number(value).toLocaleString('en-EN', { minimumFractionDigits: 0 })} %`;

  return (
    <div className={classes.container}>
      <ResponsivePie
        className={classes.pie}
        data={data}
        valueFormat={percentFormat}
        colors={(datum) => COLORS[datum.id]}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        activeOuterRadiusOffset={8}
        enableArcLinkLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="var(--color-text-primary)"
        arcLabelsComponent={({ datum, label, style }) => <CustomArcLabel datum={datum} label={label} style={style} />}
        tooltip={PieChartTooltip}
      />
    </div>
  );
};

PieChart.propTypes = {
  data: PropTypes.array,
};

export default PieChart;
