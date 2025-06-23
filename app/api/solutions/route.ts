import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const language = searchParams.get("language") || "cpp";
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const prompt = `provide the solution (in ${language.toUpperCase()}) without any comments for LeetCode problem #${id}.`;
    const result = await model.generateContent(prompt);
    const solution = result?.response?.text?.();

    return NextResponse.json({ solution });
  } catch (error: any) {
    console.error("API Error:", error.message || error);
    const message = error.message || "An unknown error occurred while generating the solution";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
