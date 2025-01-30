import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET_KEY as string,
  baseUrl: process.env.BASE_URL,
  fallbackUrl: process.env.FALLBACK_URL,
  corsOrigin: process.env.FALLBACK_URL,
  stripePrices: {
    starter: "price_1QjDolRuTMaRJMyauUcmHHN0",
    startup: "price_1QjDpYRuTMaRJMya4fDFLTBZ",
    advanced: "price_1QjDqLRuTMaRJMyaraHj6HuQ",
    enterprise: "price_1QjDqvRuTMaRJMyaZT46Mtbl",
  },
};
