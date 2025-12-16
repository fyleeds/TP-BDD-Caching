// src/middlewares/cacheMiddleware.js
const redisClient = require('../config/redis');

const cacheMiddleware = async (req, res, next) => {
  try {
    // Construire la clé Redis sous la forme product:{id}
    const id = req.params.id;
    const key = id ? `product:${id}` : 'products';

    // Vérifier si la donnée est dans le cache
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      console.log(`Cache hit for ${key}`);
      return res.send(JSON.parse(cachedData));
    }

    console.log(`Cache miss for ${key}`);
    // Si non, passer à la requête vers la base de données
    next();
  } catch (err) {
    console.error('Cache middleware error:', err);
    next(); // Continuer même en cas d'erreur Redis
  }
};

module.exports = cacheMiddleware;
