import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Popover, Tooltip } from '@mui/material';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { setDate } from '@pages/Diary/actions';

import classes from './style.module.scss';

const DiaryDate = ({ currentDate, setCurrentDate, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const [anchor, setAnchor] = useState(null);

  const handlePrevDate = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate.setDate(prevDate.getDate() - 1));
      dispatch(setDate(newDate));
      return newDate;
    });
  };

  const handleNextDate = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate.setDate(prevDate.getDate() + 1));
      dispatch(setDate(newDate));
      return newDate;
    });
  };

  const handlePopoverOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchor(null);
  };

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={classes.container} data-testid="diary-date">
      <ChevronLeft onClick={handlePrevDate} />

      <Tooltip title={formatMessage({ id: 'app_select_a_date' })}>
        <div className={classes.date} onClick={handlePopoverOpen} data-testid="calendar-date">
          {formattedDate}
        </div>
      </Tooltip>
      <ChevronRight onClick={handleNextDate} />

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        data-testid="calendar-popover"
      >
        <Calendar
          value={currentDate}
          onChange={(newDate) => {
            setCurrentDate(newDate);
            dispatch(setDate(newDate));
          }}
        />
      </Popover>
    </div>
  );
};

DiaryDate.propTypes = {
  currentDate: PropTypes.instanceOf(Date),
  setCurrentDate: PropTypes.func,
  intl: PropTypes.object,
};

export default injectIntl(DiaryDate);
