import { NextRequest, NextResponse } from "next/server";
import "@/bot/modules/start/start.handler"
export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("telegram update:", body);
  return NextResponse.json({ ok: true });
}
