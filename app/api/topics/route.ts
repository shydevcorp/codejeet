import { NextResponse } from "next/server";
import { getTopics } from "@/lib/database";

export async function GET() {
  try {
    const topics = await getTopics();

    return NextResponse.json({
      topics,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Failed to load topics from database" }, { status: 500 });
  }
}
