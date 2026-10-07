import { Router } from "express";
import { db } from "../database/connection.database";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { DashboardRepository } from "../repository/dashboard.repository";
import { DashboardController } from "../controllers/dashboard.controller";
const router = Router();
const controller = new DashboardController(new DashboardRepository(db));
router.get(
  "/dashboard/organizacao",
  new AuthMiddleware().authenticate,
  controller.summary,
);
export default router;
