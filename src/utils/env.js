import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultValue) {
  const value = process.env[name];
  console.log(`[DEBUG] Accessing env: ${name} = ${value ? '***' : 'undefined'} (default: ${defaultValue})`);

  if (value) return value;

  if (defaultValue !== undefined) return defaultValue;

  console.error(`[ERROR] Missing environment variable: ${name}`);
  throw new Error(`Missing: process.env['${name}'].`);
}
