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

const invalidateFoodsCache = async () => {
  try {
    const keys = await redisClient.smembers('foodsCacheKeys');
    keys.forEach((key) => redisClient.del(key));
    await redisClient.del('foodsCacheKeys');
  } catch (error) {
    console.error('Error invalidating food cache:', error);
  }
};

module.exports = {
  invalidateUserCache,
  invalidateFoodsCache,
};
