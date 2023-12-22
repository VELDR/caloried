import Logo from '@components/ui/Logo';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import classes from './style.module.scss';

const Footer = () => (
  <footer data-testid="footer">
    <div className={classes.socialMedia}>
      <a href="https://www.facebook.com">
        <Facebook className={classes.socialIcons} />
      </a>
      <a href="https://www.twitter.com">
        <Twitter className={classes.socialIcons} />
      </a>
      <a href="https://www.instagram.com">
        <Instagram className={classes.socialIcons} />
      </a>
    </div>
    <div className={classes.bottom}>
      <Logo className={classes.logo} />
      <div className={classes.copyright}>© 2023 Caloried. All rights reserved.</div>

      <div>
        <a href="https://storyset.com">Illustrations by Storyset</a>
        <div className={classes.nutritionix}>Powered by Nutritionix</div>
      </div>
    </div>
  </footer>
);

export default Footer;
