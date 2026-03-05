import { TaskStatus } from "@prisma/client";
import { prisma } from "../prisma/client";

export const listTasksByProject = async (projectId: string, userId: string) => {
  await ensureProjectOwnership(projectId, userId);
  return prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });
};

export const createTaskInProject = async (
  projectId: string,
  userId: string,
  title: string,
  description?: string
) => {
  await ensureProjectOwnership(projectId, userId);

  return prisma.task.create({
    data: {
      projectId,
      title,
      description,
      status: TaskStatus.TODO,
    },
  });
};

export const updateTask = async (
  id: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
  }
) => {
  await ensureTaskOwnership(id, userId);

  return prisma.task.update({
    where: { id },
    data,
  });
};

export const updateTaskStatus = async (
  id: string,
  userId: string,
  status: TaskStatus
) => {
  await ensureTaskOwnership(id, userId);

  return prisma.task.update({
    where: { id },
    data: { status },
  });
};

export const deleteTask = async (id: string, userId: string) => {
  await ensureTaskOwnership(id, userId);
  await prisma.task.delete({ where: { id } });
};

const ensureProjectOwnership = async (projectId: string, userId: string) => {
  const project = await prisma.project.findFirst({ where: { id: projectId, ownerId: userId } });
  if (!project) {
    throw new Error("Project not found");
  }
};

const ensureTaskOwnership = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, project: { ownerId: userId } },
  });

  if (!task) {
    throw new Error("Task not found");
  }
};
