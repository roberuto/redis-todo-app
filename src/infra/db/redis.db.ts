import { Client } from 'redis-om';

export const connectRedisDatabase = async () => {
  const client = new Client();
  const dbConfig = {
    url: 'redis://redisdb:6379',
  }
 
  await client.open(dbConfig.url);

  return client;
}
