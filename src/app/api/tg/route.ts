
import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/bot/modules/bot";
import { connectDB } from "@/database/database";

import "@/bot/modules/start/start.handler";
import "@/bot/modules/start/start.controller";
import "@/bot/modules/groupManger/manger.handler";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const update = await req.json();
    await bot.handleUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
