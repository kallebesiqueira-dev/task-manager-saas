import { Request, Response } from "express";
import { getDashboardData } from "../services/dashboardService";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const data = await getDashboardData(userId);
    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dashboard";
    res.status(400).json({ message });
  }
};
