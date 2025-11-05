import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });
    
    return NextResponse.json({
      exists: response.ok,
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json({
      exists: false,
      error: "Failed to check URL",
    });
  }
}