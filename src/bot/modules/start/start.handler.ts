import { Markup } from "telegraf";
import { bot } from "../bot";


bot.start((ctx) => {
  ctx.reply(
    'یکی از گزینه‌ها را انتخاب کن:',
    Markup.keyboard([
      [
        Markup.button.callback('magic', 'BTN_1'),
        Markup.button.callback('test', 'BTN_2')
      ],
      [
        Markup.button.callback('دکمه ۳', 'BTN_3')
      ],
      [
         Markup.button.callback('magic', 'BTN_1'),
        Markup.button.callback('test', 'BTN_2')
      ],
      [
        Markup.button.callback('دکمه ۴', 'BTN_4')
      ]
    ])
  );
});
bot.action('BTN_1', (ctx) => ctx.reply('شما دکمه ۱ را فشار دادید'));
bot.action('BTN_2', (ctx) => ctx.reply('شما دکمه ۲ را فشار دادید'));
bot.action('BTN_3', (ctx) => ctx.reply('شما دکمه ۳ را فشار دادید'));
bot.action('BTN_4', (ctx) => ctx.reply('شما دکمه ۴ را فشار دادید'));
bot.launch();