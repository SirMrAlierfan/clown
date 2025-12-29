import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(ctx => ctx.reply("Bot is alive"));
    
export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    await bot.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ status: "OK" });
}
