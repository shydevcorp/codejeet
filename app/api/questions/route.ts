import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

interface QuestionRecord {
  company: string;
  [key: string]: string;
}

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), "data");
    const files = await fs.readdir(dataDirectory);

    let allQuestions: QuestionRecord[] = [];

    for (const file of files) {
      if (file.endsWith(".csv")) {
        const company = file.replace(".csv", "");
        const filePath = path.join(dataDirectory, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const records: Record<string, string>[] = parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
        });

        const companyRecords: QuestionRecord[] = records.map((record) => ({
          ...record,
          company,
        }));

        allQuestions = [...allQuestions, ...companyRecords];
      }
    }

    const companies = [...new Set(allQuestions.map((q) => q.company))];

    return NextResponse.json({
      questions: allQuestions,
      companies: companies,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}
