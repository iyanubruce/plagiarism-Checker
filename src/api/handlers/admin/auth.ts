import { RequestHandler } from "express";
import {
  loginController,
  logoutController,
  getCurrentAdminController,
} from "../../../controllers/admin/auth.controller";
import { itemResponse } from "../../../helpers/utilities";
import {
  LoginInput,
  AuthResponse,
  AuthErrorResponse,
} from "../../../validations/admin/auth";

export const login: RequestHandler<
  {},
  AuthResponse | AuthErrorResponse,
  LoginInput
> = async (req, res, next) => {
  try {
    const result = await loginController(req.body);

    req.session.adminId = result.admin.id;

    res.status(200).json(itemResponse(result, 200, "Login successful"));
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      }
      res.clearCookie("admin.sid");
      res.status(200).json(itemResponse({}, 200, "Logged out successfully"));
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await getCurrentAdminController(req.session.adminId!);
    res.status(200).json(itemResponse(result, 200, "Admin retrieved"));
  } catch (error) {
    next(error);
  }
};
