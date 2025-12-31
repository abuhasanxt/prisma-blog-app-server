import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get user season
      const season = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      if (!season) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }
      if (!season.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verify your email!",
        });
      }

      req.user = {
        id: season.user.id,
        email: season.user.email,
        name: season.user.name,
        role: season.user.role as string,
        emailVerified: season.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resources!",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
