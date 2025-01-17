import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

const router = Router();
const healthController = new HealthController();

router.get("/", healthController.checkHealth);

export const healthRoutes = router;
