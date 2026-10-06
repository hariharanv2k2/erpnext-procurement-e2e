import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const ENV = {
  BASE_URL: requireEnv('BASE_URL'),
  ERP_USERNAME: requireEnv('ERP_USERNAME'),
  ERP_PASSWORD: requireEnv('ERP_PASSWORD'),
  COMPANY_NAME: requireEnv('COMPANY_NAME'),
  COMPANY_ABBR: requireEnv('COMPANY_ABBR'),
  DEFAULT_CURRENCY: requireEnv('DEFAULT_CURRENCY'),
  DEFAULT_WAREHOUSE: requireEnv('DEFAULT_WAREHOUSE'),
} as const;
