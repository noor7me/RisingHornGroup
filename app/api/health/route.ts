import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "risinghorn-group-site",
    timestamp: new Date().toISOString(),
  });
}
