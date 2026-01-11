import { redis } from "../../config/redis.js";
import { GEO_USERS_KEY } from "../../constants/redisKeys.js";

export const saveLocation = async (userId, lat, lng) => {
  await redis.geoadd(
    GEO_USERS_KEY,
    lng, // ⚠️ longitude FIRST
    lat,
    userId
  );
};

export const getNearbyUsers = async (lng, lat, radiusKm) => {
  return redis.georadius(GEO_USERS_KEY, lng, lat, radiusKm, "km", "WITHDIST");
};

export const getUserPosition = async (userId) => {
  const [pos] = await redis.geopos(GEO_USERS_KEY, userId);
  return pos; // [lng, lat] or null
};
