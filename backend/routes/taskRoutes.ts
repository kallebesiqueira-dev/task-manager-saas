import { Router } from "express";
import {
  getProjectTasks,
  patchTaskStatus,
  postTask,
  putTask,
  removeTask,
} from "../controllers/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);
router.get("/projects/:projectId/tasks", getProjectTasks);
router.post("/projects/:projectId/tasks", postTask);
router.put("/tasks/:id", putTask);
router.patch("/tasks/:id/status", patchTaskStatus);
router.delete("/tasks/:id", removeTask);

export default router;
