import { z } from "zod";

export const createRequestBodySchema = z.object({
  title: z.string().min(3).max(120),
  details: z.string().min(10).max(2000),
});

export const leakRequestSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(120),
  details: z.string().min(10).max(2000),
  likes: z.number().int().min(0),
  createdAt: z.string().datetime(),
});

export const leakRequestsArraySchema = z.array(leakRequestSchema);
