import { TaskStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import {
  createTaskInProject,
  deleteTask,
  listTasksByProject,
  updateTask,
  updateTaskStatus,
} from "../services/taskService";

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export const getProjectTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const tasks = await listTasksByProject(req.params.projectId, userId);
    res.status(200).json(tasks);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch tasks";
    res.status(400).json({ message });
  }
};

export const postTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const payload = createTaskSchema.parse(req.body);
    const task = await createTaskInProject(
      req.params.projectId,
      userId,
      payload.title,
      payload.description
    );

    res.status(201).json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task";
    res.status(400).json({ message });
  }
};

export const putTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const payload = updateTaskSchema.parse(req.body);
    const task = await updateTask(req.params.id, userId, payload);
    res.status(200).json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task";
    res.status(400).json({ message });
  }
};

export const patchTaskStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const payload = updateStatusSchema.parse(req.body);
    const task = await updateTaskStatus(req.params.id, userId, payload.status);
    res.status(200).json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task status";
    res.status(400).json({ message });
  }
};

export const removeTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await deleteTask(req.params.id, userId);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    res.status(400).json({ message });
  }
};
