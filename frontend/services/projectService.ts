import { Project } from "@/types";
import api from "./api";

export const fetchProjects = async () => {
  const { data } = await api.get<Project[]>("/projects");
  return data;
};

export const createProject = async (name: string) => {
  const { data } = await api.post<Project>("/projects", { name });
  return data;
};

export const updateProject = async (id: string, name: string) => {
  const { data } = await api.put<Project>(`/projects/${id}`, { name });
  return data;
};

export const deleteProject = async (id: string) => {
  await api.delete(`/projects/${id}`);
};
