import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Avatar, Dialog, DialogContent } from '@mui/material';
import { AlternateEmail, CalendarToday, Female, Male, Person } from '@mui/icons-material';
import { formatDate } from '@utils/formatUtils';

import PrimaryButton from '@components/ui/PrimaryButton';
import SecondaryButton from '@components/ui/SecondaryButton';
import { editProfile } from '@pages/Profile/actions';

import classes from './style.module.scss';

const EditProfileModal = ({ user, open, onClose, token, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [activeSex, setActiveSex] = useState(user?.sex);
  const [avatar, setAvatar] = useState(user?.avatar);
  const avatarFileRef = useRef();

  const handleSexSelect = (sex) => {
    setValue('sex', sex);
    setActiveSex(sex);
  };

  const handleAvatarClick = () => {
    avatarFileRef.current.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    dispatch(editProfile(formData, token, () => onClose()));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent className={classes.dialog}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.form__top}>
            <Avatar
              src={avatar?.startsWith('blob') ? avatar : `${import.meta.env.VITE_API_BASE_URL}${avatar}`}
              className={classes.image}
              onClick={handleAvatarClick}
            />
            <Controller
              name="avatar"
              control={control}
              defaultValue=""
              render={({ field: { onChange, ref } }) => (
                <input
                  ref={(e) => {
                    ref(e);
                    avatarFileRef.current = e;
                  }}
                  type="file"
                  onChange={(e) => {
                    handleAvatarChange(e);
                    onChange(e.target.files[0]);
                  }}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              )}
            />
            <div className={classes.account}>
              <div className={classes.account__form}>
                <label htmlFor="username" className={classes.label}>
                  <FormattedMessage id="app_username" />
                  <Person />
                  <input
                    id="username"
                    type="text"
                    className={`${classes.input} ${errors.username ? classes.inputError : ''}`}
                    {...register('username', { required: formatMessage({ id: 'app_username_is_required' }) })}
                    defaultValue={user?.username}
                  />
                </label>
                {errors.username && <span className={classes.error}>{errors.username.message}</span>}
              </div>
              <div className={classes.account__form}>
                <label htmlFor="email" className={classes.label}>
                  <FormattedMessage id="app_email" />
                  <AlternateEmail />
                  <input
                    id="email"
                    type="email"
                    className={`${classes.input} ${errors.email ? classes.inputError : ''}`}
                    {...register('email', { required: formatMessage({ id: 'app_email_is_required' }) })}
                    defaultValue={user?.email}
                  />
                </label>
                {errors.email && <span className={classes.error}>{errors.email.message}</span>}
              </div>
            </div>
          </div>
          <div className={classes.form__bottom}>
            <div className={classes.physique}>
              <input type="hidden" {...register('sex')} defaultValue={user?.sex} />
              <div className={classes.sex}>
                <div className={classes.sex__label}>
                  <FormattedMessage id="app_sex" />
                </div>
                <div className={classes.sex__option}>
                  <div
                    onClick={() => handleSexSelect('male')}
                    className={`${classes.sex__item} ${classes.sex__male} ${
                      activeSex === 'male' ? classes.activeMale : ''
                    }`}
                  >
                    <Male />
                    <div className={classes.sex__text}>
                      <FormattedMessage id="app_male" />
                    </div>
                  </div>
                  <div
                    onClick={() => handleSexSelect('female')}
                    className={`${classes.sex__item} ${classes.sex__female} ${
                      activeSex === 'female' ? classes.activeFemale : ''
                    }`}
                  >
                    <Female />
                    <div className={classes.sex__text}>
                      <FormattedMessage id="app_female" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.formInput}>
                <label htmlFor="dob" className={classes.label}>
                  <FormattedMessage id="app_dob" />
                  <input
                    id="dob"
                    type="date"
                    className={`${classes.input} ${errors.dob ? classes.inputError : ''}`}
                    {...register('dob', {
                      required: formatMessage({ id: 'app_date_is_required' }),
                    })}
                    defaultValue={formatDate(user?.dob)}
                  />
                  <CalendarToday className={`${classes.calendar} ${classes.adornment}`} />
                </label>
                {errors.dob && <span className={classes.error}>{errors.dob.message}</span>}
              </div>
              <div className={classes.formInput}>
                <label htmlFor="height" className={classes.label}>
                  <FormattedMessage id="app_height" />
                  <input
                    id="height"
                    type="number"
                    className={`${classes.input} ${errors.height ? classes.inputError : ''}`}
                    {...register('height', { required: formatMessage({ id: 'app_height_is_required' }) })}
                    defaultValue={user?.height}
                  />
                  <div className={classes.adornment}>cm</div>
                </label>
                {errors.height && <span className={classes.error}>{errors.height.message}</span>}
              </div>
              <div className={classes.formInput}>
                <label htmlFor="weight" className={classes.label}>
                  <FormattedMessage id="app_weight" />
                  <input
                    id="weight"
                    type="number"
                    className={`${classes.input} ${errors.weight ? classes.inputError : ''}`}
                    {...register('weight', { required: formatMessage({ id: 'app_weight_is_required' }) })}
                    defaultValue={user?.weight}
                  />
                  <div className={classes.adornment}>kg</div>
                </label>
                {errors.weight && <span className={classes.error}>{errors.weight.message}</span>}
              </div>
              <div className={classes.formInput}>
                <label htmlFor="activityLevel" className={classes.label}>
                  <FormattedMessage id="app_activity_level" />
                  <select
                    id="activityLevel"
                    className={classes.input}
                    {...register('activityLevel', { required: true })}
                    defaultValue={user?.activityLevel}
                  >
                    <option value={1}>
                      <FormattedMessage id="app_sedentary" />
                    </option>
                    <option value={2}>
                      <FormattedMessage id="app_lightly_active" />
                    </option>
                    <option value={3}>
                      <FormattedMessage id="app_moderately_active" />
                    </option>
                    <option value={4}>
                      <FormattedMessage id="app_very_active" />
                    </option>
                    <option value={5}>
                      <FormattedMessage id="app_intensely_active" />
                    </option>
                  </select>
                </label>
              </div>
              <div className={classes.formInput}>
                <label htmlFor="goal" className={classes.label}>
                  <FormattedMessage id="app_goal" />
                  <select
                    id="goal"
                    className={classes.input}
                    {...register('goal', { required: true })}
                    defaultValue={user?.goal}
                  >
                    <option value="gain">
                      <FormattedMessage id="app_gain" />
                    </option>
                    <option value="maintain">
                      <FormattedMessage id="app_maintain" />
                    </option>
                    <option value="lose">
                      <FormattedMessage id="app_lose" />
                    </option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className={classes.buttons}>
            <SecondaryButton className={classes.button} onClick={onClose}>
              <FormattedMessage id="app_cancel" />
            </SecondaryButton>
            <PrimaryButton className={classes.button}>
              <div className={classes.text}>
                <FormattedMessage id="app_save" />
              </div>
            </PrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditProfileModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
  token: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(EditProfileModal);
