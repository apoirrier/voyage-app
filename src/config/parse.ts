// Parse configuration - environment variables required
const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set. Please check your .env.local file.`);
  }
  return value;
};

export const PARSE_CONFIG = {
  APP_ID: getRequiredEnvVar('VUE_APP_PARSE_APP_ID'),
  JS_KEY: getRequiredEnvVar('VUE_APP_PARSE_JS_KEY'),
  SERVER_URL: process.env.VUE_APP_PARSE_SERVER_URL || 'https://parseapi.back4app.com/'
};

export const IMGUR_CONFIG = {
  CLIENT_ID: getRequiredEnvVar('VUE_APP_IMGUR_ID')
};