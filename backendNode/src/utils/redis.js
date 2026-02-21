import Redis from "ioredis";

let redis = null;

try {
    redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
        maxRetriesPerRequest: 0,
        lazyConnect: true,
    });
    await redis.connect();
    console.log("Redis connected successfully");
} catch (err) {
    console.warn("Redis not available, event publishing will be skipped:", err.message);
    redis = null;
}

const publishEvent = async (channel, payload) => {
    if (!redis) return;
    try {
        await redis.publish(channel, JSON.stringify(payload));
    } catch (err) {
        console.error(`Failed to publish event on ${channel}:`, err.message);
    }
};

export { publishEvent };
