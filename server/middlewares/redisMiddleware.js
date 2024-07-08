const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const cacheTodos = async (req, res, next) => {
    try {
        const redisData = await redis.get('todos');
        if (redisData) {
            return res.status(200).send({ message: 'Todos retrieved from cache', success: true, data: JSON.parse(redisData) });
        }
        next();
    } catch (error) {
        console.error('Redis cache error:', error);
        next();
    }
};

const setTodosCache = async (data) => {
    try {
        await redis.set('todos', JSON.stringify(data), 'EX', 3600); // Cache expires in 1 hour
    } catch (error) {
        console.error('Error setting Redis cache:', error);
    }
};

const invalidateTodosCache = async () => {
    try {
        await redis.del('todos');
    } catch (error) {
        console.error('Error invalidating Redis cache:', error);
    }
};

module.exports = { cacheTodos, setTodosCache, invalidateTodosCache };

