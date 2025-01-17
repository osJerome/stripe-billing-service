import { Request, Response } from "express";
import { StripeService } from "../services/stripe.service";

export class SubscriptionController {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  createSubscription = async (req: Request, res: Response) => {
    const tier = req.query.tier as string;

    if (!tier) {
      return res.status(400).send("Subscription tier not found");
    }

    try {
      const session = await this.stripeService.createCheckoutSession(tier);
      if (session.url) {
        res.send({ session_id: session.id, url: session.url });
      } else {
        res
          .status(500)
          .send("An error occurred while creating the subscription.");
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while creating the subscription.");
    }
  };

  handleSuccess = async (req: Request, res: Response) => {
    const sessionId = req.query.session_id as string;
    const session = await this.stripeService.retrieveSession(sessionId);
    res.redirect(`http://localhost:3000/customers/${session.customer}`);
  };

  handleCustomerPortal = async (req: Request, res: Response) => {
    try {
      const portalSession = await this.stripeService.createPortalSession(
        req.params.customerId
      );
      res.redirect(portalSession.url);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while creating the customer portal session.");
    }
  };
}
