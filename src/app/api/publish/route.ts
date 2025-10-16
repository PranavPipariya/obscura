// // app/api/publish/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";
// import crypto from "crypto";
// import {
//   publishBodySchema,
//   leaksArraySchema,
//   leakSchema,
// } from "@/lib/schemas/leaks";

// const dataDir = path.join(process.cwd(), "data");
// const leaksPath = path.join(dataDir, "leaks.json");

// export async function POST(req: NextRequest) {
//   const json = await req.json().catch(() => null);
//   const parsed = publishBodySchema.safeParse(json);
//   if (!parsed.success) {
//     return NextResponse.json(
//       { error: "Invalid body", issues: parsed.error.flatten() },
//       { status: 400 },
//     );
//   }

//   await fs.mkdir(dataDir, { recursive: true });

//   // Load existing leaks (validate if present)
//   let leaks: unknown = [];
//   try {
//     const raw = await fs.readFile(leaksPath, "utf8");
//     leaks = JSON.parse(raw);
//   } catch {
//     // file might not exist yet — fine
//     leaks = [];
//   }
//   const leaksParsed = leaksArraySchema.safeParse(leaks);
//   const safeLeaks = leaksParsed.success ? leaksParsed.data : [];

//   const leakCandidate = {
//     id: crypto.randomUUID(),
//     description: parsed.data.description,
//     proof: parsed.data.proof,
//     createdAt: new Date().toISOString(),
//   };

//   // Validate the new leak object too (defensive)
//   const leak = leakSchema.parse(leakCandidate);

//   const updated = [leak, ...safeLeaks]; // newest first
//   await fs.writeFile(leaksPath, JSON.stringify(updated, null, 2), "utf8");

//   return NextResponse.json({ success: true, leak }, { status: 200 });
// }

import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/mongodb";
import crypto from "crypto";
import { publishBodySchema, leakSchema } from "@/lib/schemas/leaks";

export async function POST(req: NextRequest) {
  if (!client) {
    return NextResponse.json(
      { error: "Mongo client not initialized" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = publishBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const candidate = {
    id: crypto.randomUUID(),
    description: parsed.data.description.trim().slice(0, 500),
    proof: parsed.data.proof,
    createdAt: new Date().toISOString(),
  };
  const leak = leakSchema.parse(candidate);

  const db = client.db(process.env.MONGODB_DB);
  await db
    .collection("leaks")
    .insertOne({ ...leak, _createdAt: new Date(leak.createdAt) });

  return NextResponse.json({ success: true, leak }, { status: 200 });
}
