import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}
const genAI = new GoogleGenerativeAI(apiKey);
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `Provide the solution (in Java) without any comments for LeetCode problem #${id}.`;

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
