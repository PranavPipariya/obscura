import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { leakRequestsArraySchema } from "@/lib/schemas/requests";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "requests.json");

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = leakRequestsArraySchema.safeParse(JSON.parse(raw));
    const items = parsed.success ? parsed.data : [];
    const idx = items.findIndex((r) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    items[idx] = { ...items[idx], likes: items[idx].likes + 1 };
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
    return NextResponse.json(
      { success: true, item: items[idx] },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: "Failed to like", e }, { status: 500 });
  }
}
