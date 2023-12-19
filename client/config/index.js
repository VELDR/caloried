import development from '@config/development';
import production from '@config/production';
import test from '@config/test.env';

const nodeENV = process.env.NODE_ENV || 'development';

const env = { production, development, test }[nodeENV];

const config = {
  api: {
    host: env.API_HOST,
    base: env.API_BASE,
  },
  crypto: {
    secret: env.CRYPTOJS_SECRET,
  },
};

export default config;
