import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative("Price cannot be negative"),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .nonnegative("Stock cannot be negative"),
  userId: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
