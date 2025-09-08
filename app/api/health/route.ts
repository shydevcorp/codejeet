import { NextResponse } from "next/server";

export async function GET() {
  try {
    return new NextResponse("OK", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    return new NextResponse("ERROR", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
