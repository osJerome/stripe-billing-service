import { Request, Response } from "express";
import os from "os";

export class HealthController {
  async checkHealth(req: Request, res: Response) {
    const healthCheck = {
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
      systemInfo: {
        platform: process.platform,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        cpus: os.cpus().length,
      },
    };

    try {
      res.status(200).json(healthCheck);
      res.send(healthCheck);
    } catch (error) {
      healthCheck.message = "Error";
      res.status(503).json(healthCheck);
    }
  }
}
