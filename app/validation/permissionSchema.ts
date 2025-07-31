// validation/permissionSchema.ts
import { z } from "zod";

export const permissionSchema = z.object({
  permission: z
    .string()
    .trim()
    .min(1, "Permission is required")
    .regex(
      /^[A-Za-z\s]+:\s?[A-Za-z]+$/,
      "Format must be: Role : action (e.g., Admin : update)"
    ),
});

export type PermissionInput = z.infer<typeof permissionSchema>;
