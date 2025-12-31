
import { Telegraf, Context } from "telegraf";

declare global {
  var _bot: Telegraf<Context> | undefined;
}

export const bot =
  global._bot ??
  new Telegraf<Context>(process.env.BOT_TOKEN!);

if (!global._bot) {
  global._bot = bot;
}
