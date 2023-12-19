import PropTypes from 'prop-types';
import { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { ExpandMore } from '@mui/icons-material';
import { Avatar, Menu, MenuItem } from '@mui/material';

import { setLocale } from '@containers/App/actions';
import { selectLocale } from '@containers/App/selectors';

import classes from './style.module.scss';

const TranslateDropdown = ({ locale }) => {
  const dispatch = useDispatch();
  const [menuPosition, setMenuPosition] = useState(null);
  const open = Boolean(menuPosition);

  const handleClick = (event) => {
    setMenuPosition(event.currentTarget);
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const onSelectLang = (lang) => {
    if (lang !== locale) {
      dispatch(setLocale(lang));
    }
    handleClose();
  };

  return (
    <div data-testid="translate-dropdown">
      <div className={classes.toggle} onClick={handleClick}>
        <Avatar className={classes.avatar} src={locale === 'id' ? '/id.png' : '/en.png'} />
        <div className={classes.lang}>{locale}</div>
        <ExpandMore />
      </div>
      <Menu open={open} anchorEl={menuPosition} onClose={handleClose}>
        <MenuItem onClick={() => onSelectLang('id')} selected={locale === 'id'}>
          <div className={classes.menu}>
            <Avatar className={classes.menuAvatar} src="/id.png" />
            <div className={classes.menuLang}>
              <FormattedMessage id="app_lang_id" />
            </div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => onSelectLang('en')} selected={locale === 'en'}>
          <div className={classes.menu}>
            <Avatar className={classes.menuAvatar} src="/en.png" />
            <div className={classes.menuLang}>
              <FormattedMessage id="app_lang_en" />
            </div>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

TranslateDropdown.propTypes = {
  locale: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
});

export default connect(mapStateToProps)(TranslateDropdown);
