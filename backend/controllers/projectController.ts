import { Request, Response } from "express";
import { z } from "zod";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "../services/projectService";

const projectSchema = z.object({
  name: z.string().min(2),
});

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const projects = await listProjects(userId);
    res.json(projects);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    res.status(400).json({ message });
  }
};

export const postProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const payload = projectSchema.parse(req.body);
    const project = await createProject(userId, payload.name);
    res.status(201).json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    res.status(400).json({ message });
  }
};

export const putProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const payload = projectSchema.parse(req.body);
    const project = await updateProject(req.params.id, userId, payload.name);
    res.status(200).json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    res.status(400).json({ message });
  }
};

export const removeProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await deleteProject(req.params.id, userId);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    res.status(400).json({ message });
  }
};
