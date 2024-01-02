import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isRoleMatch } from '@utils/authUtils';
import { formatCustomFoodForm } from '@utils/formatUtils';
import noResults from '@static/images/no-result.svg';
import { Upload } from '@mui/icons-material';

import PrimaryButton from '@components/ui/PrimaryButton';
import CustomFoodForm from '@components/CustomFoodForm';
import FoodCard from '@components/FoodCard';
import { selectToken } from '@containers/Client/selectors';
import { selectMyFoods } from './selectors';
import { getMyFoods } from './actions';

import classes from './style.module.scss';

const MyFoods = ({ myFoods, token }) => {
  const dispatch = useDispatch();
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isRoleMatch(token, 'user')) {
      dispatch(getMyFoods(token));
    }
  }, [dispatch, token]);

  const handleFoodCardClick = (food) => {
    const formattedFood = formatCustomFoodForm(food);
    setSelectedFood(formattedFood);
  };
  const handleCloseModal = () => {
    setSelectedFood(null);
    setIsModalOpen(false);
  };
  return (
    <div className={classes.page} data-testid="my-foods">
      <div className={classes.container}>
        <div className={classes.header}>
          <FormattedMessage id="app_my_foods" />
        </div>
        <div className={classes.myFoods}>
          {myFoods && myFoods.length > 0 ? (
            myFoods?.map((food, index) => (
              <FoodCard key={index} food={food} onClick={() => handleFoodCardClick(food)} />
            ))
          ) : (
            <div className={classes.noResults}>
              <img src={noResults} alt="" />
              <FormattedMessage id="app_no_custom_foods" />
            </div>
          )}
        </div>
      </div>
      <div>
        <PrimaryButton isSubmit={false} className={classes.button} onClick={handleOpenClick}>
          <Upload />
          <FormattedMessage id="app_submit_food" />
        </PrimaryButton>
      </div>
      <CustomFoodForm open={isModalOpen} onClose={handleCloseModal} token={token} />
      {selectedFood && <CustomFoodForm open onClose={handleCloseModal} token={token} food={selectedFood} />}
    </div>
  );
};

MyFoods.propTypes = {
  myFoods: PropTypes.array,
  token: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  myFoods: selectMyFoods,
  token: selectToken,
});

export default connect(mapStateToProps)(MyFoods);
