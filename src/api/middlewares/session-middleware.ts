import { Request, Response, NextFunction } from "express";
import { AdminDatabase } from "../../database/AdminDatabase";

declare module "express-session" {
  interface SessionData {
    adminId?: string;
  }
}

const adminDb = new AdminDatabase();

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.adminId) {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }

  const admin = adminDb.findById(req.session.adminId);
  if (!admin) {
    req.session.destroy(() => {});
    return res.status(401).json({
      status: "error",
      message: "Invalid session",
    });
  }

  next();
};
