import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Cancel, CheckCircle } from '@mui/icons-material';

import { isRoleMatch } from '@utils/authUtils';
import { formatDateAndTime } from '@utils/formatUtils';
import { SEX_COLORS } from '@constants';
import config from '@config/index';
import foodIcon from '@static/images/food.svg';

import ConfirmDeleteModal from '@components/ui/ConfirmDeleteModal';
import DemographicsBarChart from '@components/charts/DemographicsBarChart';
import PieChart from '@components/charts/PieChart';
import SexDistributionTooltip from '@components/charts/SexDistributionTooltip';

import { selectToken } from '@containers/Client/selectors';
import { calculateDistributionPercentage } from '@utils/calculateUtils';
import {
  selectCustomFoods,
  selectDemographics,
  selectSexDistribution,
  selectTotalCustomFoods,
  selectTotalUsers,
  selectUsers,
} from './selectors';
import {
  deleteCustomFoodById,
  deleteUserById,
  getAllCustomFoods,
  getAllUsers,
  getUserDemographics,
  getUserSexDistribution,
} from './actions';

import classes from './style.module.scss';

const Admin = ({
  token,
  users,
  totalUsers,
  demographics,
  sexDistribution,
  customFoods,
  totalCustomFoods,
  intl: { formatMessage },
}) => {
  const dispatch = useDispatch();

  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedView, setSelectedView] = useState('USERS');
  const formattedDistribution = calculateDistributionPercentage(sexDistribution);

  useEffect(() => {
    if (isRoleMatch(token, 'admin')) {
      dispatch(getUserDemographics(token));
      dispatch(getUserSexDistribution(token));
      if (selectedView === 'USERS') {
        dispatch(getAllUsers(page + 1, rowsPerPage, token, orderBy, orderDirection));
      } else if (selectedView === 'CUSTOM_FOODS') {
        dispatch(getAllCustomFoods(page + 1, rowsPerPage, token, orderBy, orderDirection));
      }
    }
  }, [dispatch, orderBy, orderDirection, page, rowsPerPage, selectedView, token]);

  const getSortColumnName = (header) => {
    switch (header) {
      case formatMessage({ id: 'app_username' }):
        return 'username';
      case formatMessage({ id: 'app_actions' }):
        return 'id';
      case formatMessage({ id: 'app_email' }):
        return 'email';
      case formatMessage({ id: 'app_email_verified' }):
        return 'isEmailVerified';
      case formatMessage({ id: 'app_registration_date' }):
        return 'createdAt';
      case formatMessage({ id: 'app_food_name' }):
        return 'name';
      case formatMessage({ id: 'app_created_by' }):
        return 'userId';
      case formatMessage({ id: 'app_serving_size' }):
        return 'servingSize';
      default:
        return header.toLowerCase();
    }
  };

  const handleRequestSort = (header) => {
    const property = getSortColumnName(header);
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    if (selectedView === 'USERS') {
      dispatch(getAllUsers(page + 1, rowsPerPage, token, property, isAsc ? 'asc' : 'desc'));
    } else if (selectedView === 'CUSTOM_FOODS') {
      dispatch(getAllCustomFoods(page + 1, rowsPerPage, token, property, isAsc ? 'asc' : 'desc'));
    }
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      if (selectedView === 'USERS') {
        dispatch(deleteUserById(itemToDelete, token));
      } else if (selectedView === 'CUSTOM_FOODS') {
        dispatch(deleteCustomFoodById(itemToDelete, token));
      }
    }
    setIsModalOpen(false);
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const renderTableHeaders = () => {
    if (selectedView === 'USERS') {
      return [
        'ID',
        formatMessage({ id: 'app_username' }),
        formatMessage({ id: 'app_email' }),
        formatMessage({ id: 'app_email_verified' }),
        formatMessage({ id: 'app_registration_date' }),
        formatMessage({ id: 'app_actions' }),
      ];
    }
    if (selectedView === 'CUSTOM_FOODS') {
      return [
        'ID',
        formatMessage({ id: 'app_food_name' }),
        formatMessage({ id: 'app_created_by' }),
        formatMessage({ id: 'app_serving_size' }),
        formatMessage({ id: 'app_calories' }),
        formatMessage({ id: 'app_protein' }),
        formatMessage({ id: 'app_carbs' }),
        formatMessage({ id: 'app_fat' }),
        formatMessage({ id: 'app_actions' }),
      ];
    }
  };

  const renderTableRows = () => {
    if (selectedView === 'USERS') {
      return users?.map((user) => (
        <TableRow key={user?.id}>
          <TableCell>{user?.id}</TableCell>
          <TableCell>
            <div className={classes.user}>
              <Avatar src={`${config.api.base}${user?.avatar}`} alt={user?.username} className={classes.avatar} />
              {user?.username}
            </div>
          </TableCell>
          <TableCell>{user?.email}</TableCell>
          <TableCell className={classes.verified}>{user?.isEmailVerified ? <CheckCircle /> : <Cancel />}</TableCell>
          <TableCell>{formatDateAndTime(user?.createdAt)}</TableCell>
          <TableCell>
            <div className={classes.delete} onClick={() => handleDeleteClick(user?.id)}>
              <FormattedMessage id="app_delete" />
            </div>
          </TableCell>
        </TableRow>
      ));
    }
    if (selectedView === 'CUSTOM_FOODS') {
      return customFoods?.map((food) => (
        <TableRow key={food?.id}>
          <TableCell>{food?.id}</TableCell>
          <TableCell>
            <div className={classes.food}>
              <Avatar
                src={food?.image ? `${config.api.base}${food?.image}` : foodIcon}
                alt={food?.name}
                className={classes.avatar}
              />
              {food?.name}
            </div>
          </TableCell>
          <TableCell>{food?.user?.username}</TableCell>
          <TableCell>{food?.servingSize}</TableCell>
          <TableCell>{food?.calories}kcal</TableCell>
          <TableCell>{food?.protein}g</TableCell>
          <TableCell>{food?.carbs}g</TableCell>
          <TableCell>{food?.fat}g</TableCell>
          <TableCell>
            <div className={classes.delete} onClick={() => handleDeleteClick(food?.id)}>
              <FormattedMessage id="app_delete" />
            </div>
          </TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <div className={classes.page}>
      <div className={classes.title}>
        <FormattedMessage id="app_welcome_admin" />
      </div>
      <div className={classes.filter}>
        <div
          className={`${classes.filter__item} ${selectedView === 'USERS' ? classes.active : ''}`}
          onClick={() => handleViewChange('USERS')}
        >
          <FormattedMessage id="app_users" />
        </div>
        <div
          className={`${classes.filter__item} ${selectedView === 'CUSTOM_FOODS' ? classes.active : ''}`}
          onClick={() => handleViewChange('CUSTOM_FOODS')}
        >
          <FormattedMessage id="app_foods" />
        </div>
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table aria-label="users table">
          <TableHead className={classes.tableHead}>
            <TableRow>
              {renderTableHeaders().map((header) => (
                <TableCell key={header} className={classes.tableHead__cell}>
                  <TableSortLabel
                    active={orderBy === getSortColumnName(header)}
                    direction={orderBy === getSortColumnName(header) ? orderDirection : 'asc'}
                    onClick={() => handleRequestSort(header)}
                    className={classes.headLabel}
                  >
                    {header}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
        <TablePagination
          component="div"
          count={selectedView === 'USERS' ? totalUsers : totalCustomFoods}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </TableContainer>
      <div className={classes.analytics}>
        <div className={classes.analytics__title}>
          <FormattedMessage id="app_user_demographics" />
        </div>
        <div className={classes.chart}>
          <div className={classes.chart__bar}>{demographics && <DemographicsBarChart data={demographics} />}</div>
          <div className={classes.chart__pie}>
            {formattedDistribution && (
              <PieChart data={formattedDistribution} colors={SEX_COLORS} tooltip={SexDistributionTooltip} />
            )}
          </div>
        </div>
      </div>
      <ConfirmDeleteModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleConfirmDelete} />
    </div>
  );
};

Admin.propTypes = {
  token: PropTypes.string,
  users: PropTypes.array,
  totalUsers: PropTypes.number,
  demographics: PropTypes.array,
  sexDistribution: PropTypes.array,
  intl: PropTypes.object,
  customFoods: PropTypes.array,
  totalCustomFoods: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  users: selectUsers,
  totalUsers: selectTotalUsers,
  demographics: selectDemographics,
  sexDistribution: selectSexDistribution,
  customFoods: selectCustomFoods,
  totalCustomFoods: selectTotalCustomFoods,
});

export default injectIntl(connect(mapStateToProps)(Admin));
