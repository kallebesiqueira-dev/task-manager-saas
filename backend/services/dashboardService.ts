import { TaskStatus } from "@prisma/client";
import { prisma } from "../prisma/client";

export const getDashboardData = async (userId: string) => {
  const [projectCount, tasks, recentTasks] = await Promise.all([
    prisma.project.count({ where: { ownerId: userId } }),
    prisma.task.findMany({
      where: { project: { ownerId: userId } },
      select: { status: true },
    }),
    prisma.task.findMany({
      where: { project: { ownerId: userId } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
    }),
  ]);

  const taskCounters = {
    todo: tasks.filter((task) => task.status === TaskStatus.TODO).length,
    inProgress: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
    done: tasks.filter((task) => task.status === TaskStatus.DONE).length,
  };

  return {
    projectCount,
    taskCounters,
    recentActivity: recentTasks,
  };
};
