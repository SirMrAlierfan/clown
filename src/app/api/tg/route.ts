import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/bot/modules/bot";
import "@/bot/modules/start/start.handler"; // register handlers
import "@/bot/modules/start/start.controller"
import "@/bot/modules/groupManger/manger.handler"
import '@/bot/modules/groupData/data.getter'
import { connectDB } from "../../../database/database";

export async function POST(req: NextRequest) {
  connectDB()
  const update = await req.json();
  await bot.handleUpdate(update);
  return NextResponse.json({ ok: true });
}
