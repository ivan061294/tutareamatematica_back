import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder',
  currency: process.env.STRIPE_CURRENCY || 'usd',
}));
