import Stripe from "stripe";
import { config } from "../config/config";

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: "2022-11-15",
    });
  }

  async createCheckoutSession(tier: string, fallbackUrl?: string) {
    const priceId = this.getPriceIdForTier(tier);
    if (!priceId) throw new Error("Invalid subscription tier");

    return this.stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${config.baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: fallbackUrl || config.fallbackUrl,
    });
  }

  async cancelSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  async getSubscriptionDetails(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    return {
      subscription: session.subscription,
      customer: session.customer,
      status: session.status,
      paymentStatus: session.payment_status,
    };
  }

  async retrieveSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async createPortalSession(customerId: string) {
    return this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${config.fallbackUrl}`,
    });
  }

  verifyWebhookSignature(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripeWebhookSecret
    );
  }

  private getPriceIdForTier(tier: string): string | null {
    const tierKey = tier.toLowerCase() as keyof typeof config.stripePrices;
    return config.stripePrices[tierKey] || null;
  }
}
