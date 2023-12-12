import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ResponsiveTimeRange } from '@nivo/calendar';
import { formatDate } from '@utils/formatUtils';

import classes from './style.module.scss';

const ActivityCalendar = ({ activity, intl: { formatMessage } }) => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const from = formatDate(oneYearAgo);
  const to = formatDate(today);
  const theme = {
    labels: {
      text: {
        fontFamily: 'Poppins',
        fontSize: 11,
        fontWeight: 500,
        fill: 'var(--color-text-primary)',
      },
    },
  };
  const calendarTooltip = (data) => {
    const date = new Date(data.day);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);

    return (
      <div className={classes.tooltip}>
        <div className={classes.tooltip__text}>{`${data.value} ${formatMessage({
          id: 'app_food_logged_on',
        })} ${dayOfWeek}, ${month} ${date.getDate()}, ${date.getFullYear()}.`}</div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <ResponsiveTimeRange
        data={activity}
        from={from}
        to={to}
        emptyColor="var(--color-bg-tertiary)"
        colors={[
          'rgba(25, 255, 25, 0.2)',
          'rgba(25, 255, 25, 0.4)',
          'rgba(25, 255, 25, 0.6)',
          'rgba(25, 255, 25, 0.8)',
          'rgba(25, 255, 25, 1)',
        ]}
        theme={theme}
        maxValue={10}
        margin={{ top: 20, right: 20 }}
        monthBorderColor="var(--color-bg-primary)"
        weekdayLegendOffset={60}
        firstWeekday="monday"
        dayRadius={3}
        daySpacing={3}
        dayBorderColor="var(--color-bg-primary)"
        tooltip={(data) => calendarTooltip(data)}
      />
    </div>
  );
};

ActivityCalendar.propTypes = {
  activity: PropTypes.array,
  intl: PropTypes.object,
};

export default injectIntl(ActivityCalendar);
