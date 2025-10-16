import { z } from "zod";

// If your Zod is older than 3.22 (no .datetime()), uncomment the fallback:
// const datetimeString = z.string().refine(
//   (s) => !Number.isNaN(Date.parse(s)),
//   "Invalid ISO datetime"
// );

export const proofBlobSchema = z.object({
  proofData: z.unknown(),
  publicData: z.record(z.string(), z.unknown()).optional(),
  externalInputs: z.record(z.string(), z.unknown()).optional(),
  isLocal: z.boolean(),
  blueprintSlug: z.string().min(1),
});

export const leakSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1).max(500),
  proof: proofBlobSchema,
  createdAt: z.string().datetime(), // use datetimeString if you uncommented the fallback
});

export const publishBodySchema = z.object({
  description: z.string().min(1).max(500),
  proof: proofBlobSchema,
});

export const leaksArraySchema = z.array(leakSchema);
