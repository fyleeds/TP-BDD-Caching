const redis = require('redis');

let client;
let redisAvailable = false;

try {
  client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    socket: {
      reconnectStrategy: () => false // pas de retry infini
    }
  });

  client.on('connect', () => {
    redisAvailable = true;
    console.log('✅ Redis connected');
  });

  client.on('error', (err) => {
    redisAvailable = false;
    console.error('⚠️ Redis error:', err.message);
  });

  client.connect().catch(() => {
    console.warn('⚠️ Redis unavailable, cache disabled');
  });

} catch (err) {
  console.warn('⚠️ Redis init failed, cache disabled');
}

module.exports = {
  isAvailable: () => redisAvailable,
  get: async (key) => redisAvailable ? client.get(key) : null,
  set: async (...args) => redisAvailable ? client.set(...args) : null,
  del: async (key) => redisAvailable ? client.del(key) : null
};
