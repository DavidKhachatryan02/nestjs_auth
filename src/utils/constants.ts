import { config } from 'dotenv';
config();

export const JwtSecret = process.env.JWT_SECRET;

export const Salt = +process.env.SALT_ROUNDS;

export const APP_PORT = process.env.APP_PORT || 3000;
