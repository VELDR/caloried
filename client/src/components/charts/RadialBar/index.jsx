import { ResponsiveRadialBar } from '@nivo/radial-bar';

import classes from './style.module.scss';

const RadialBar = () => {
  const data = [
    {
      id: 'Supermarket',
      data: [
        {
          x: 'Vegetables',
          y: 182,
        },
      ],
    },
    {
      id: 'Combini',
      data: [
        {
          x: 'Vegetables',
          y: 140,
        },
      ],
    },
  ];
  return (
    <div className={classes.container}>
      <ResponsiveRadialBar
        data={data}
        valueFormat=">-.2f"
        startAngle={-141}
        endAngle={150}
        innerRadius={0.55}
        padding={0.25}
        cornerRadius={45}
        margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
        enableCircularGrid={false}
        radialAxisStart={{ tickSize: 8, tickPadding: 6, tickRotation: 0 }}
        circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
      />
    </div>
  );
};
export default RadialBar;
