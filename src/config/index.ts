import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });

export const {
  NODE_ENV,
  PORT,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  SESSION_SECRET,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_PUBLIC_BUCKET_NAME,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} = process.env;
