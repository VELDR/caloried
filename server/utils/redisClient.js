const Redis = require('ioredis');

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

redisClient.on('connect', () => {
  console.log('Redis is now connected. 🔌');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error: ', err);
});

module.exports = redisClient;
