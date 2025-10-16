import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import {
  createRequestBodySchema,
  leakRequestsArraySchema,
  leakRequestSchema,
} from "@/lib/schemas/requests";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "requests.json");

async function readAll() {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = leakRequestsArraySchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

async function writeAll(items: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}

export async function GET() {
  const items = await readAll();
  // newest first
  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json(items, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createRequestBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const all = await readAll();
  const candidate = {
    id: crypto.randomUUID(),
    title: parsed.data.title.trim(),
    details: parsed.data.details.trim(),
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  const item = leakRequestSchema.parse(candidate);
  await writeAll([item, ...all]);
  return NextResponse.json({ success: true, item }, { status: 200 });
}
