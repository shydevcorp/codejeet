import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/database";

export async function GET() {
  try {
    const companies = await getCompanies();

    return NextResponse.json(
      {
        companies: companies.map((c) => c.name),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: "Failed to load companies from database" }, { status: 500 });
  }
}
