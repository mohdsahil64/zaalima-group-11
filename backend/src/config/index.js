import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ats_database',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expire: process.env.JWT_EXPIRE || '7d',
    cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7,
  },

  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || '',
    s3Bucket: process.env.AWS_S3_BUCKET || '',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },

  google: {
    aiApiKey: process.env.GOOGLE_AI_API_KEY || '',
  },
};

export default config;
