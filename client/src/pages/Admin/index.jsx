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

import ConfirmDeleteModal from '@components/ui/ConfirmDeleteModal';
import DemographicsBarChart from '@components/charts/DemographicsBarChart';
import PieChart from '@components/charts/PieChart';
import SexDistributionTooltip from '@components/charts/SexDistributionTooltip';

import { selectToken } from '@containers/Client/selectors';
import { calculateDistributionPercentage } from '@utils/calculateUtils';
import { selectDemographics, selectSexDistribution, selectTotalUsers, selectUsers } from './selectors';
import { deleteUserById, getAllUsers, getUserDemographics, getUserSexDistribution } from './actions';

import classes from './style.module.scss';

const Admin = ({ token, users, totalUsers, demographics, sexDistribution, intl: { formatMessage } }) => {
  const dispatch = useDispatch();

  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const formattedDistribution = calculateDistributionPercentage(sexDistribution);

  useEffect(() => {
    if (isRoleMatch(token, 'admin')) {
      dispatch(getAllUsers(page + 1, rowsPerPage, token, orderBy, orderDirection));
      dispatch(getUserDemographics(token));
      dispatch(getUserSexDistribution(token));
    }
  }, [dispatch, orderBy, orderDirection, page, rowsPerPage, token]);

  const getSortColumnName = (header) => {
    switch (header) {
      case formatMessage({ id: 'app_username' }):
        return 'username';
      case formatMessage({ id: 'app_email' }):
        return 'email';
      case formatMessage({ id: 'app_email_verified' }):
        return 'isEmailVerified';
      case formatMessage({ id: 'app_registration_date' }):
        return 'createdAt';
      default:
        return header.toLowerCase();
    }
  };

  const handleRequestSort = (header) => {
    const property = getSortColumnName(header);
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    dispatch(getAllUsers(page + 1, rowsPerPage, token, property, isAsc ? 'asc' : 'desc'));
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUserById(userToDelete, token));
    }
    setIsModalOpen(false);
  };

  const tableHeaders = [
    'ID',
    formatMessage({ id: 'app_username' }),
    formatMessage({ id: 'app_email' }),
    formatMessage({ id: 'app_email_verified' }),
    formatMessage({ id: 'app_registration_date' }),
    formatMessage({ id: 'app_actions' }),
  ];

  return (
    <div className={classes.page}>
      <div className={classes.title}>
        <FormattedMessage id="app_welcome_admin" />
      </div>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table aria-label="users table">
          <TableHead className={classes.tableHead}>
            <TableRow>
              {tableHeaders.map((header) => (
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
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user?.id}>
                <TableCell>{user?.id}</TableCell>
                <TableCell>
                  <div className={classes.user}>
                    <Avatar src={`${config.api.base}${user?.avatar}`} alt={user?.username} className={classes.avatar} />
                    {user?.username}
                  </div>
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell className={classes.verified}>
                  {user?.isEmailVerified ? <CheckCircle /> : <Cancel />}
                </TableCell>
                <TableCell>{formatDateAndTime(user?.createdAt)}</TableCell>
                <TableCell>
                  <div className={classes.delete} onClick={() => handleDeleteClick(user?.id)}>
                    <FormattedMessage id="app_delete" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalUsers}
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
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  users: selectUsers,
  totalUsers: selectTotalUsers,
  demographics: selectDemographics,
  sexDistribution: selectSexDistribution,
});

export default injectIntl(connect(mapStateToProps)(Admin));
