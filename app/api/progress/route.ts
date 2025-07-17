import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserProgress, updateUserProgress, syncUserProgress } from "@/lib/database";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await getUserProgress(userId);

    return NextResponse.json(
      { progress },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json({ error: "Failed to fetch user progress" }, { status: 500 });
  }
}

// POST /api/progress - Update a single question progress
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionSlug, completed } = await request.json();

    if (!questionSlug || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body. Expected questionSlug and completed fields." },
        { status: 400 }
      );
    }

    await updateUserProgress(userId, questionSlug, completed);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating user progress:", error);
    return NextResponse.json({ error: "Failed to update user progress" }, { status: 500 });
  }
}

// PUT /api/progress - Sync local progress with remote
export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let requestBody;
    try {
      const requestText = await request.text();
      if (!requestText.trim()) {
        requestBody = { localProgress: {} };
      } else {
        requestBody = JSON.parse(requestText);
      }
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { localProgress } = requestBody;
    const safeLocalProgress =
      localProgress && typeof localProgress === "object" ? localProgress : {};
    const mergedProgress = await syncUserProgress(userId, safeLocalProgress);

    return NextResponse.json({ progress: mergedProgress }, { status: 200 });
  } catch (error) {
    console.error("Error syncing user progress:", error);
    return NextResponse.json({ error: "Failed to sync user progress" }, { status: 500 });
  }
}
