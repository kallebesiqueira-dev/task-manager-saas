export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  projectId: string;
  createdAt: string;
}

export interface DashboardData {
  projectCount: number;
  taskCounters: {
    todo: number;
    inProgress: number;
    done: number;
  };
  recentActivity: Array<
    Task & {
      project: {
        id: string;
        name: string;
      };
    }
  >;
}
