import api from "./api";
import { AuthResponse } from "@/types";

export const registerRequest = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
};

export const loginRequest = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
};
