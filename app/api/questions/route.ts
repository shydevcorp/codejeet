import { NextResponse } from "next/server";
import { getQuestionsFromDatabase } from "@/lib/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const companies = searchParams.get("companies")?.split(",").filter(Boolean);
    const difficulties = searchParams.get("difficulties")?.split(",").filter(Boolean) as (
      | "Easy"
      | "Medium"
      | "Hard"
    )[];
    const topics = searchParams.get("topics")?.split(",").filter(Boolean);
    const timeframes = searchParams.get("timeframes")?.split(",").filter(Boolean) as (
      | "30_days"
      | "3_months"
      | "6_months"
      | "more_than_6m"
      | "all"
    )[];
    const isPremium = undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    const result = await getQuestionsFromDatabase({
      companies,
      difficulties,
      topics,
      timeframes,
      isPremium,
      search,
      limit,
      offset,
    });

    return NextResponse.json(
      {
        questions: result.questions,
        companies: result.companies,
        totalCount: result.totalCount,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to load questions from database" }, { status: 500 });
  }
}
