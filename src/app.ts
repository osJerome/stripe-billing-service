import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "./config/config";
import { subscriptionRoutes } from "./routes/subscription.route";
import { healthRoutes } from "./routes/health.route";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// Health check route should be first
app.use("/", healthRoutes);
app.use("/", subscriptionRoutes);

export { app };
