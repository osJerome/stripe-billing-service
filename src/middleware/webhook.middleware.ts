import { Request, Response, NextFunction } from "express";
import { StripeService } from "../services/stripe.service";

export class WebhookMiddleware {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  async handleWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;

    try {
      const event = this.stripeService.verifyWebhookSignature(req.body, sig);

      switch (event.type) {
        case "checkout.session.completed":
          console.log("New Subscription started!", event.data);
          break;
        case "invoice.paid":
          console.log("Invoice paid", event.data);
          break;
        case "invoice.payment_failed":
          console.log("Invoice payment failed!", event.data);
          break;
        case "customer.subscription.updated":
          console.log("Subscription updated!", event.data);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.send();
    } catch (err) {
      console.error(`Webhook Error: ${err}`);
      return res.status(400).send(`Webhook Error: ${err}`);
    }
  }
}
