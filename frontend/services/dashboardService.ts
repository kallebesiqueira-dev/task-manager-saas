import { DashboardData } from "@/types";
import api from "./api";

export const fetchDashboard = async () => {
  const { data } = await api.get<DashboardData>("/dashboard");
  return data;
};
