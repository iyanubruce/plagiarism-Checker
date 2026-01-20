import { AdminDatabase } from "../../database/AdminDatabase";
import BadRequestError from "../../errors/badRequestError";
import { LoginInput } from "../../validations/admin/auth";

const adminDb = new AdminDatabase();

export const loginController = async (input: LoginInput) => {
  const { email, password } = input;

  const admin = adminDb.findByEmail(email);
  if (!admin) {
    throw new BadRequestError("Invalid email or password");
  }

  const isValid = await adminDb.validatePassword(admin, password);
  if (!isValid) {
    throw new BadRequestError("Invalid email or password");
  }

  adminDb.updateLastLogin(admin.id);

  return {
    success: true,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
    },
  };
};

export const logoutController = async () => {
  return {
    success: true,
    message: "Logged out successfully",
  };
};

export const getCurrentAdminController = async (adminId: string) => {
  const admin = adminDb.findById(adminId);
  if (!admin) {
    throw new BadRequestError("Admin not found");
  }

  return {
    success: true,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      lastLogin: admin.lastLogin,
    },
  };
};
