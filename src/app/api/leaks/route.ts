// // app/api/leaks/route.ts
// import { NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";
// import { leaksArraySchema } from "@/lib/schemas/leaks";

// const leaksPath = path.join(process.cwd(), "data", "leaks.json");

// export async function GET() {
//   try {
//     const raw = await fs.readFile(leaksPath, "utf8");
//     const parsed = leaksArraySchema.safeParse(JSON.parse(raw));
//     if (!parsed.success) {
//       return NextResponse.json([], { status: 200 });
//     }
//     return NextResponse.json(parsed.data, { status: 200 });
//   } catch {
//     return NextResponse.json([], { status: 200 });
//   }
// }

import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET() {
  if (!client) {
    return NextResponse.json(
      { error: "Mongo client not initialized" },
      { status: 500 },
    );
  }

  const db = client.db(process.env.MONGODB_DB);
  const docs = await db
    .collection("leaks")
    .find({})
    .sort({ _createdAt: -1 })
    .limit(200)
    .project({ _id: 0 })
    .toArray();

  return NextResponse.json(docs);
}
