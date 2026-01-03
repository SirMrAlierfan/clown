
import { bot } from "../bot";
import { startComposer } from "./start.handler";

const userMessages: Record<number, string> = {};
let userId: number | undefined;
let userName: string;
startComposer.action("gap", (ctx) => {
  ctx.reply("https://t.me/joinchat/qc6GaSXlxktmMDA0");
});
startComposer.action("IdFounder", async (ctx) => {
  userId = ctx.chat?.id;
  userName = ctx.from.first_name;
  await ctx.reply(`your id is : ${userId}\n for:${userName}`);
});
startComposer.action("pvMsg", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("write your msg");

  const handler = (ctx2: any) => {
    const userId = ctx2.from.id;
    if (!userMessages[userId]) {
      const msg = ctx2.message.text;
      userMessages[userId] = msg;
      ctx2.reply("your message has been saved!");
      bot.telegram.sendMessage(
        7584261287,
        `Message from @${ctx2.from.username || ctx2.from.first_name}:\n${msg}`,
      );
    }
  };

  startComposer.on("text", handler);
});
startComposer.action("privetMsg", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("write your msg to batman as privet");
  const handler = (ctx2: any) => {
    const msg = ctx2.message.text;
    ctx2.reply("your message has been delverd!");
    bot.telegram.sendMessage(7584261287, `Message :${msg}`);
  };
  startComposer.on("text", handler);
});
