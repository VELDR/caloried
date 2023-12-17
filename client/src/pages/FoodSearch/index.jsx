import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Pagination } from '@mui/material';
import noResults from '@static/images/no-result.svg';
import { isRoleMatch } from '@utils/authUtils';

import FoodCard from '@components/FoodCard';

import { selectToken } from '@containers/Client/selectors';
import { selectCurrentPage, selectFoods, selectPageSize, selectTotalItems } from './selectors';
import { getFoods, setCurrentPage } from './actions';

import classes from './style.module.scss';

const FoodSearch = ({ token, foods, currentPage, pageSize, totalItems, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query');
  const page = searchParams.get('page') || currentPage;
  const size = searchParams.get('pageSize') || pageSize;
  const totalPages = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    if (query) {
      if (isRoleMatch(token, 'user')) {
        dispatch(getFoods(query, page, size, selectedCategory, token));
      }
    }
  }, [dispatch, query, page, size, selectedCategory, token]);

  const handlePageChange = (event, newPage) => {
    if (query) {
      setSearchParams({ query, page: newPage, pageSize: size });
      dispatch(setCurrentPage(newPage));
      dispatch(getFoods(query, newPage, size, selectedCategory, token));
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (query) {
      setSearchParams({ query, page: 1, pageSize: size });
      dispatch(setCurrentPage(1));
      dispatch(getFoods(query, 1, size, category, token));
    }
  };

  const handleFoodCardClick = (food) => {
    navigate(`/food/${food?.type}/${encodeURIComponent(food?.foodName)}`);
  };

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.header__title}>
            {query
              ? `${formatMessage({ id: 'app_search_results' })} "${query}"`
              : formatMessage({ id: 'app_type_to_search' })}
          </div>
          <div className={classes.category}>
            {['All', 'Common', 'Branded'].map((category) => (
              <div className={classes.categoryWrapper} key={category}>
                <div
                  className={
                    selectedCategory === category
                      ? `${classes.active} ${classes.category__item}`
                      : classes.category__item
                  }
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </div>
              </div>
            ))}
          </div>
        </div>
        {foods && foods.length > 0 ? (
          foods.map((food, index) => <FoodCard key={index} food={food} onClick={() => handleFoodCardClick(food)} />)
        ) : (
          <div className={classes.noResults}>
            <img src={noResults} alt="" />
            <FormattedMessage id="app_blank_result" />
          </div>
        )}
      </div>
      <Pagination
        className={classes.pagination}
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
      />
    </div>
  );
};

FoodSearch.propTypes = {
  token: PropTypes.string,
  foods: PropTypes.array,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalItems: PropTypes.number,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  foods: selectFoods,
  currentPage: selectCurrentPage,
  pageSize: selectPageSize,
  totalItems: selectTotalItems,
});

export default injectIntl(connect(mapStateToProps)(FoodSearch));
