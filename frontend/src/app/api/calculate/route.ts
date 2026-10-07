import { NextResponse } from "next/server";

const DEFAULT_API_URL = "http://localhost:8000";

function calculationUrl(): URL {
  const baseUrl = process.env.HPHE_API_URL ?? DEFAULT_API_URL;
  return new URL("calculate", `${baseUrl.replace(/\/$/, "")}/`);
}

export async function POST(request: Request) {
  try {
    const response = await fetch(calculationUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });

    const body = await response.text();
    return new Response(body, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json(
      { detail: "The thermal calculation service is unavailable." },
      { status: 502 },
    );
  }
}
