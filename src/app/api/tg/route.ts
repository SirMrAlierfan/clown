import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/bot/modules/bot";
import "@/bot/modules/start/start.handler"; // register handlers
import "@/bot/modules/start/start.controller"
import "@/bot/modules/groupManger/manger.controller"
import "@/bot/modules/groupManger/manger.handler"


export async function POST(req: NextRequest) {
  const update = await req.json();
  await bot.handleUpdate(update);
  return NextResponse.json({ ok: true });
}
