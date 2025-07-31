import { z } from "zod";

export const roleSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, "Role name is required")
    .regex(/^[A-Za-z\s]+$/, "Role name can only contain letters and spaces"),
});

export type RoleData = z.infer<typeof roleSchema>;
