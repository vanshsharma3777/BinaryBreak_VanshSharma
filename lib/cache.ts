import { redis } from "./redis";

export async function cache<T>(
  key: string,
  cb: () => Promise<T>,
  ttl: number = 60
): Promise<T> {
  const cached = await redis.get(key);

  if (cached) {
    return cached as T;
  }

  const freshData = await cb();

  await redis.set(key, freshData, {
    ex: ttl, // seconds
  });

  return freshData;
}