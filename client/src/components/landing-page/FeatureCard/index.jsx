import PropTypes from 'prop-types';

import classes from './style.module.scss';

const FeatureCard = ({ icon, title, subtitle }) => (
  <div className={classes.card}>
    {icon}
    <div className={classes.card__description}>
      <div className={classes.title}>{title}</div>
      <div className={classes.subtitle}>{subtitle}</div>
    </div>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default FeatureCard;
