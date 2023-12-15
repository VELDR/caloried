const redisClient = require('../utils/redisClient');

const invalidateUserCache = async () => {
  try {
    const keys = await redisClient.smembers('usersCacheKeys');
    keys.forEach((key) => redisClient.del(key));
    await redisClient.del('usersCacheKeys');
  } catch (error) {
    console.error('Error invalidating user cache:', error);
  }
};

module.exports = {
  invalidateUserCache,
};
