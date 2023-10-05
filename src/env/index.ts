import { config } from 'dotenv';
import { z as zod } from 'zod';

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test'
  });
} else {
  config();
}

export const envSchema = zod.object({
  NODE_ENV: zod.enum(['development', 'test', 'production']).default('development'),
  DATABASE_CLIENT: zod.enum(['sqlite', 'pg']),
  DATABASE_URL: zod.string(),
  PORT: zod.coerce.number().default(3333)
});

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('⚠️ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables');
}

export const env = _env.data
