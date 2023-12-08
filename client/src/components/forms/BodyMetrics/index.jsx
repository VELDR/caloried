import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import toast from 'react-hot-toast';
import { Cake, CalendarToday, Female, Male, SquareFoot, Wc } from '@mui/icons-material';

import { nextStep, setMetrics } from '@pages/SignUp/actions';
import { selectMetrics } from '@pages/SignUp/selectors';

import FormFooter from '@components/forms/FormFooter';
import FormHeader from '@components/forms/FormHeader';

import classes from './style.module.scss';

const BodyMetrics = ({ metrics, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const [metricsData, setMetricsData] = useState({
    sex: metrics.sex || '',
    dob: metrics.dob || '',
    height: metrics.height || '',
    weight: metrics.weight || '',
  });

  const handleSexSelect = (sex) => {
    setMetricsData({ ...metricsData, sex });
  };

  const handleInputChange = (e) => {
    setMetricsData({ ...metricsData, [e.target.name]: e.target.value });
  };

  const validateMetrics = () => {
    const { sex, dob, height, weight } = metricsData;
    const today = new Date();
    const dobDate = new Date(dob);
    if (!sex) {
      toast.error(formatMessage({ id: 'app_error_sex' }));
      return false;
    }
    if (!dob || dobDate >= today) {
      toast.error(formatMessage({ id: 'app_error_weight' }));
      return false;
    }
    if (!height || height < 120 || height > 250) {
      toast.error(formatMessage({ id: 'app_error_weight' }));
      return false;
    }
    if (!weight || weight < 20 || weight > 400) {
      toast.error(formatMessage({ id: 'app_error_weight' }));
      return false;
    }
    return true;
  };

  const handleFormSubmit = () => {
    if (validateMetrics()) {
      dispatch(setMetrics(metricsData));
      dispatch(nextStep());
    }
  };
  return (
    <div className={classes.form}>
      <FormHeader
        title={formatMessage({ id: 'app_metrics_title' })}
        description={formatMessage({ id: 'app_metrics_description' })}
      />

      <div className={classes.metrics}>
        <div className={classes.attributes}>
          <div className={classes.sex}>
            <div className={classes.sex__title}>
              <Wc />
              <FormattedMessage id="app_biological_sex" />
            </div>
            <div className={classes.sex__option}>
              <div
                className={`${classes.sex__item} ${classes.sex__male} ${
                  metricsData.sex === 'male' ? classes.activeMale : ''
                }`}
                onClick={() => handleSexSelect('male')}
              >
                <Male />
                <div className={classes.sex__label}>
                  <FormattedMessage id="app_male" />
                </div>
              </div>
              <div
                className={`${classes.sex__item} ${classes.sex__female} ${
                  metricsData.sex === 'female' ? classes.activeFemale : ''
                }`}
                onClick={() => handleSexSelect('female')}
              >
                <Female />
                <div className={classes.sex__label}>
                  <FormattedMessage id="app_female" />
                </div>
              </div>
            </div>
          </div>
          <div className={classes.dob}>
            <div className={classes.dob__label}>
              <Cake /> <FormattedMessage id="app_dob" />
            </div>
            <div className={classes.wrapper}>
              <input
                type="date"
                name="dob"
                className={classes.dob__input}
                value={metricsData.dob}
                onChange={handleInputChange}
              />
              <CalendarToday className={classes.calendar} />
            </div>
          </div>
        </div>
        <div className={classes.measurements}>
          <div className={classes.measurements__title}>
            <SquareFoot /> <FormattedMessage id="app_measurements" />
          </div>
          <div className={classes.measurement}>
            <div className={classes.measurement__item}>
              <div className={classes.label}>
                <FormattedMessage id="app_height" />
              </div>
              <div className={classes.wrapper}>
                <input
                  type="number"
                  name="height"
                  className={classes.input}
                  value={metricsData.height}
                  onChange={handleInputChange}
                />
                <div className={classes.adornment}>cm</div>
              </div>
            </div>
            <div className={classes.measurement__item}>
              <div className={classes.label}>
                <FormattedMessage id="app_weight" />
              </div>
              <div className={classes.wrapper}>
                <input
                  type="number"
                  name="weight"
                  className={classes.input}
                  value={metricsData.weight}
                  onChange={handleInputChange}
                />
                <div className={classes.adornment}>kg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormFooter onContinue={handleFormSubmit} />
    </div>
  );
};

BodyMetrics.propTypes = {
  metrics: PropTypes.object,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  metrics: selectMetrics,
});

export default injectIntl(connect(mapStateToProps)(BodyMetrics));
