import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").at(-2); // extracts the [id] param

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  if (!client) {
    return NextResponse.json(
      { error: "Mongo client not initialized" },
      { status: 500 },
    );
  }

  const db = client.db(process.env.MONGODB_DB);

  const res = await db
    .collection("requests")
    .findOneAndUpdate(
      { id },
      { $inc: { likes: 1 } },
      { returnDocument: "after", projection: { _id: 0 } },
    );

  // res itself might be null
  if (!res || !res.value) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, item: res.value }, { status: 200 });
}
