import { bot } from "../bot";
import { startComposer } from "./start.handler";
const waitingForPvMessage = new Set<number>();
startComposer.action("gap", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("https://t.me/joinchat/qc6GaSXlxktmMDA0");
});

startComposer.action("IdFounder", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `your id is : ${ctx.from.id}\nfor: ${ctx.from.first_name}`
  );
});

startComposer.action("pvMsg", async (ctx) => {
  await ctx.answerCbQuery();
  waitingForPvMessage.add(ctx.from.id);
  await ctx.reply("پیام خود را ارسال کنید");
});


startComposer.on("text", async (ctx, next) => {
  const userId = ctx.from.id;

  if (!waitingForPvMessage.has(userId)) {
    return next();
  }

  waitingForPvMessage.delete(userId);

  await bot.telegram.sendMessage(
    7584261287,
    `Message from ${ctx.from.username || ctx.from.first_name}:\n${ctx.message.text}`
  );

  await ctx.reply("پیام شما ارسال شد");
});