import { Task, TaskStatus } from "@/types";
import api from "./api";

export const fetchTasks = async (projectId: string) => {
  const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`);
  return data;
};

export const createTask = async (
  projectId: string,
  payload: { title: string; description?: string }
) => {
  const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, payload);
  return data;
};

export const updateTask = async (
  id: string,
  payload: { title?: string; description?: string; status?: TaskStatus }
) => {
  const { data } = await api.put<Task>(`/tasks/${id}`, payload);
  return data;
};

export const updateTaskStatus = async (id: string, status: TaskStatus) => {
  const { data } = await api.patch<Task>(`/tasks/${id}/status`, { status });
  return data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};
