import { config } from "../config/config";
import { Request, Response } from "express";
import { StripeService } from "../services/stripe.service";

export class SubscriptionController {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  createSubscription = async (req: Request, res: Response) => {
    const tier = req.query.tier as string;
    const fallbackUrl = req.query.fallbackUrl as string;

    if (!tier) {
      return res.status(400).send("Subscription tier not found");
    }

    try {
      const session = await this.stripeService.createCheckoutSession(tier, fallbackUrl);
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

  cancelSubscription = async (req: Request, res: Response) => {
    const subscriptionId = req.params.subscriptionId;

    if (!subscriptionId) {
      return res.status(400).send("Subscription ID is required");
    }

    try {
      const canceledSubscription = await this.stripeService.cancelSubscription(
        subscriptionId
      );
      res.json(canceledSubscription);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while canceling the subscription");
    }
  };

  getSubscriptionDetails = async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId;

    if (!sessionId) {
      return res.status(400).send("Session ID is required");
    }

    try {
      const subscriptionDetails =
        await this.stripeService.getSubscriptionDetails(sessionId);
      res.json(subscriptionDetails);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while retrieving subscription details");
    }
  };

  handleSuccess = async (req: Request, res: Response) => {
    const sessionId = req.query.session_id as string;
    const session = await this.stripeService.retrieveSession(sessionId);
    res.redirect(`${config.baseUrl}/customers/${session.customer}`);
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
