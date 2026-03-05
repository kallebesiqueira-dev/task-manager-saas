import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);
router.get("/", getDashboard);

export default router;
