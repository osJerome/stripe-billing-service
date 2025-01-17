import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET_KEY as string,
  baseUrl: process.env.BASE_URL,
  fallbackUrl: process.env.FALLBACK_URL,
  corsOrigin: "http://localhost:5173",
  stripePrices: {
    startups: "price_1QhhIcRuTMaRJMyaUj98FtA4",
    advanced: "price_1QhhIqRuTMaRJMyaWcjhHuQl",
    enterprise: "price_1QhhJ4RuTMaRJMyaUS0ciSed",
  },
};
