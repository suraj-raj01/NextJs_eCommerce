// validation/userSchema.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[A-Za-z\s]+$/, 'Name must only contain letters and spaces'),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
