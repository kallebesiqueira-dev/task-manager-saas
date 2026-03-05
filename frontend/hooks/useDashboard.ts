"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/services/dashboardService";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
};
