import { Router } from "express";
import {
  getProjects,
  postProject,
  putProject,
  removeProject,
} from "../controllers/projectController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);
router.get("/", getProjects);
router.post("/", postProject);
router.put("/:id", putProject);
router.delete("/:id", removeProject);

export default router;
