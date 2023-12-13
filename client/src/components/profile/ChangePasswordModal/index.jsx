import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dialog, DialogContent } from '@mui/material';

import { Key, LockPerson, LockReset, Visibility, VisibilityOff } from '@mui/icons-material';
import SecondaryButton from '@components/ui/SecondaryButton';
import PrimaryButton from '@components/ui/PrimaryButton';
import { changePassword } from '@pages/Profile/actions';

import classes from './style.module.scss';

const ChangePasswordModal = ({ open, onClose, token, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    dispatch(
      changePassword(data, token, () => {
        onClose();
        reset();
      })
    );
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent className={classes.dialog}>
        <div className={classes.dialog__title}>
          <LockReset /> <FormattedMessage id="app_change_password" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <div className={classes.form__item}>
            <label htmlFor="currentPassword" className={classes.label}>
              <FormattedMessage id="app_current_password" />
              <LockPerson />
              <input
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                className={`${classes.input} ${errors.currentPassword ? classes.inputError : ''}`}
                {...register('currentPassword', {
                  required: formatMessage({ id: 'app_current_password_is_required' }),
                })}
              />
              <div onClick={handleTogglePasswordVisibility} className={classes.eyeIcon}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </label>
            {errors.currentPassword && <span className={classes.error}>{errors.currentPassword.message}</span>}
          </div>
          <div className={classes.form__item}>
            <label htmlFor="newPassword" className={classes.label}>
              <FormattedMessage id="app_new_password" />
              <Key />
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                className={`${classes.input} ${errors.newPassword ? classes.inputError : ''}`}
                {...register('newPassword', {
                  required: formatMessage({ id: 'app_new_password_is_required' }),
                })}
              />
              <div onClick={handleTogglePasswordVisibility} className={classes.eyeIcon}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </label>
            {errors.newPassword && <span className={classes.error}>{errors.newPassword.message}</span>}
          </div>
          <div className={classes.buttons}>
            <SecondaryButton className={classes.button} onClick={onClose}>
              <FormattedMessage id="app_cancel" />
            </SecondaryButton>
            <PrimaryButton className={classes.button}>
              <div className={classes.text}>
                <FormattedMessage id="app_change" />
              </div>
            </PrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

ChangePasswordModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  intl: PropTypes.object,
  token: PropTypes.string,
};

export default injectIntl(ChangePasswordModal);
