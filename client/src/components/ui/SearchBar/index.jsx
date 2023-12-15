import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Search } from '@mui/icons-material';
import { setCurrentPage } from '@pages/FoodSearch/actions';

import classes from './style.module.scss';

const SearchBar = ({ intl: { formatMessage } }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}&page=1`);
    dispatch(setCurrentPage(1));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div className={classes.search}>
      <input
        type="search"
        className={classes.search__input}
        placeholder={formatMessage({ id: 'app_search_for_food' })}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <div className={classes.icon} onClick={handleSearch}>
        <Search />
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(SearchBar);
