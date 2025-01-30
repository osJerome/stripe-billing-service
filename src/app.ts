import express from "express";
import cors from "cors";
import { config } from "./config/config";
import { healthRoutes } from "./routes/health.route";
import { subscriptionRoutes } from "./routes/subscription.route";
import { WebhookMiddleware } from "./middleware/webhook.middleware";

const app = express();
const webhookMiddleware = new WebhookMiddleware();

app.post("/webhook", express.raw({ type: "application/json" }), webhookMiddleware.handleWebhook.bind(webhookMiddleware));

app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/", healthRoutes);
app.use("/", subscriptionRoutes);

export { app };
