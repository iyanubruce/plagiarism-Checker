import { z } from "zod";

export const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};

export type LoginInput = z.infer<typeof loginSchema.body>;

export interface AuthResponse {
  success: true;
  admin: {
    id: string;
    username: string;
    email: string;
  };
}

export interface AuthErrorResponse {
  error: string;
}
