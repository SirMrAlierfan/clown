import { Markup } from 'telegraf';
import { bot } from '@/bot/modules/bot';



bot.start(async (ctx) => {
  await ctx.reply(
    'what do you want from this clown',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('circus addres', 'gap'),
        Markup.button.url("add to group ","https://t.me/batmanclownbot?startgroup=true" )
      ],
      [
        Markup.button.callback('pv to batman', 'pvMsg')]
      ,   
      [
        Markup.button.callback("what is my id?", "IdFounder")
      ], [
        Markup.button.callback("send privet Msg", "privetMsg")
      ]
    ])
  );
});
