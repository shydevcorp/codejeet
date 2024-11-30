import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { Headers } from "node-fetch";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const language = searchParams.get("language") || "cpp";

    if (!id) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const apiKey =
      new Headers(request.headers).get("x-gemini-key") ||
      process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const getLanguageSpecificInstructions = (language: string): string => {
      switch (language.toLowerCase()) {
        case "cpp":
          return "Generate answer using namespace std. Do not mention the library imports and 'using namespace std;' at top and";
        default:
          return "";
      }
    };

    const languageInstructions = getLanguageSpecificInstructions(language);
    const prompt = `${languageInstructions} provide the solution (in ${language.toUpperCase()}) without any comments for LeetCode problem #${id}.`;

    const result = await model.generateContent(prompt);
    const solution = result?.response?.text?.();

    if (!solution) {
      throw new Error("No solution generated or invalid response structure");
    }

    return NextResponse.json({ solution });
  } catch (error: any) {
    console.error("API Error:", error.message || error);
    const message =
      error.message ||
      "An unknown error occurred while generating the solution";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
