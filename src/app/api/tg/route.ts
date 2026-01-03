import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/bot/modules/bot";
import { connectDB } from "@/database/database";

import { managerComposer } from "@/bot/modules/groupManger/manger.handler";
import { listComposer } from "@/bot/modules/groupData/data.getter";
import { startComposer } from "@/bot/modules/start/start.handler";
bot.use(startComposer);
bot.use(managerComposer);
bot.use(listComposer);

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const update = await req.json();

    await bot.handleUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
