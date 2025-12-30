import { Markup } from 'telegraf';
import { bot } from '@/bot/modules/bot';

const adminId = 123456789; // آیدی خودت در تلگرام
const userMessages: Record<number, string> = {}; // ذخیره پیام‌ها بر اساس user id

bot.start(async (ctx) => {
  await ctx.reply(
    'what do you want from this clown',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('circus addres', 'gap'),
        Markup.button.callback('pv to batman', 'pvMsg')
      ]
    ])
  );
});

bot.action("gap", (ctx) => {
  ctx.reply("https://t.me/joinchat/qc6GaSXlxktmMDA0");
});

bot.action("pvMsg", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("write your msg");

  const handler = (ctx2: any) => {
    const userId = ctx2.from.id;

    if (!userMessages[userId]) {
      const msg = ctx2.message.text;
      userMessages[userId] = msg;

      ctx2.reply("your message has been saved!");

      bot.telegram.sendMessage(7584261287, `Message from @${ctx2.from.username || ctx2.from.first_name}:\n${msg}`);

      
    }
  };

  bot.on('text', handler);
});
