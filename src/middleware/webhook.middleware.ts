import { Request, Response } from "express";
import { StripeService } from "../services/stripe.service";

export class WebhookMiddleware {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  // Arrow function preserves 'this' context
  handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const rawBody = req.body;

    try {
      const event = this.stripeService.verifyWebhookSignature(rawBody, sig);
      // Rest of your handler logic
      res.json({ received: true });
    } catch (err) {
      console.error(`Webhook Error: ${err}`);
      res.status(400).send(`Webhook Error: ${err}`);
    }
  };
}