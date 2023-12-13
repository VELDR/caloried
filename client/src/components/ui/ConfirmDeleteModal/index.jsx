import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    PaperProps={{
      style: { padding: '0.5rem' },
    }}
  >
    <DialogContent className={classes.dialog}>
      <FormattedMessage id="app_are_you_sure_delete" />
    </DialogContent>
    <DialogActions className={classes.actions}>
      <button type="button" className={`${classes.button} ${classes.cancel}`} onClick={onClose}>
        <FormattedMessage id="app_cancel" />
      </button>
      <button type="button" className={`${classes.button} ${classes.delete}`} onClick={onConfirm}>
        <FormattedMessage id="app_delete" />
      </button>
    </DialogActions>
  </Dialog>
);

ConfirmDeleteModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default ConfirmDeleteModal;
