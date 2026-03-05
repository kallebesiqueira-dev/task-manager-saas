import { prisma } from "../prisma/client";

export const listProjects = (userId: string) => {
  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });
};

export const createProject = (userId: string, name: string) => {
  return prisma.project.create({
    data: {
      name,
      ownerId: userId,
    },
  });
};

export const updateProject = async (id: string, userId: string, name: string) => {
  const project = await prisma.project.findFirst({ where: { id, ownerId: userId } });
  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.project.update({
    where: { id },
    data: { name },
  });
};

export const deleteProject = async (id: string, userId: string) => {
  const project = await prisma.project.findFirst({ where: { id, ownerId: userId } });
  if (!project) {
    throw new Error("Project not found");
  }

  await prisma.project.delete({ where: { id } });
};
