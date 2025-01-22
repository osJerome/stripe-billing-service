import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";
import { WebhookMiddleware } from "../middleware/webhook.middleware";
import express from "express";

const router = Router();
const subscriptionController = new SubscriptionController();
const webhookMiddleware = new WebhookMiddleware();

router.get("/subscribe", subscriptionController.createSubscription);
router.get("/success", subscriptionController.handleSuccess);
router.get(
  "/customers/:customerId",
  subscriptionController.handleCustomerPortal
);
router.delete(
  "/subscriptions/:subscriptionId",
  subscriptionController.cancelSubscription
);
router.get(
  "/subscriptions/session/:sessionId",
  subscriptionController.getSubscriptionDetails
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookMiddleware.handleWebhook.bind(webhookMiddleware)
);

export const subscriptionRoutes = router;
