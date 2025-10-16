// lib/types/leaks.ts
export type ProofBlob = {
  proofData: unknown; // opaque Groth16 payload; kept as unknown
  publicData: Record<string, unknown> | undefined;
  externalInputs: Record<string, unknown> | undefined;
  isLocal: boolean;
  blueprintSlug: string;
};

export type Leak = {
  id: string;
  description: string; // <= 500 chars
  proof: ProofBlob;
  createdAt: string; // ISO string
};
