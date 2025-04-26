import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultsecret',
    expiresIn: '24h', // Default expiration time: 24 hours
  },
}));
