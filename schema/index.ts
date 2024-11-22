import { z } from "zod";

export const authResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expire: z.string(),
});

export const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  gender: z.string(),
  phone_number: z.string(),
  user_id: z.string(),
  branch_id: z.string(),
  username: z.string(),
  role: z.string(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  updated_at: z.string(),
});

export const loginSchema = z.object({
  username: z.string().min(2).max(250),
  password: z.string().min(6).max(100),
});

export type LoginData = z.infer<typeof loginSchema>;

export const adminSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.string().optional(),
  phone_number: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminFormData = z.infer<typeof adminSchema>;
