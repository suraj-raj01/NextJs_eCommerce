// validation/userSchema.ts
import { z } from "zod";
export const taxRuleSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  rate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Rate must be a valid number with up to two decimal places")
    .transform((val) => parseFloat(val)),
});
export type TaxRuleFormData = z.infer<typeof taxRuleSchema>;