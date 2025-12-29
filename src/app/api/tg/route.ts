import { NextRequest, NextResponse } from 'next/server';


import '@/bot/modules/start/start.handler';
import { bot } from '@/bot/modules/bot';

export async function POST(req: NextRequest) {
  const update = await req.json();

  await bot.handleUpdate(update);

  return NextResponse.json({ ok: true });
}
