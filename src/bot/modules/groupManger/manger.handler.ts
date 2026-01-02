import { ban } from "@/database/models/banList";
import { bot } from "../bot";
import { silent } from "@/database/models/silentList";
import { promote } from "@/database/models/promotedList";
import { NickName } from "@/database/models/nickNameList";
import { Composer, Context } from "telegraf";
import { ensureDB } from "@/database/init";
import mongoose from "mongoose";
import { banHandler, unBanHandler } from "./managerHandlers/ban";
import { silentHandler, unSilentHandler } from "./managerHandlers/silent";
import { isPromoted } from "./managerHandlers/cheeker";

console.log("GROUP MANAGER LOADED");
export interface CommandContext {
  chatId: number;
  userId: number;
  targetUserId: number;
  targetUsername: string;
  ctx: any;
  options?: {
    nickName?: string;
    duration?: number;
  };
}

export type CommandHandler = (data: CommandContext) => Promise<void>;



export const managerComposer = new Composer();
bot.on("my_chat_member", async (ctx) => {
  await ensureDB();

  const { old_chat_member, new_chat_member, chat } = ctx.myChatMember;

  if (
    old_chat_member.status === "left" &&
    (new_chat_member.status === "member" ||
      new_chat_member.status === "administrator")
  ) {
    const chatId = chat.id;

    await bot.telegram.sendMessage(chat.id, "سلام! ربات با موفقیت به گروه اضافه شد ✅");


    const admins = await ctx.getChatAdministrators();

    for (const admin of admins) {
      if (admin.user.is_bot) continue;

      await promote.updateOne(
        { userId: admin.user.id, chatId },
        { $set: { PromotedBy: admin.user.id, promotedAt: Date.now() } },
        { upsert: true }
      );
    }
  }
});


managerComposer.on("text", async (ctx, next) => {
  await ensureDB()
  const chatId = ctx.chat.id;
  const userId: number = ctx.from.id;
  const admins = await ctx.getChatAdministrators();
  const isAdmin = admins.some(a => a.user.id === userId);
  if (await isPromoted(userId, chatId) && isAdmin) {

    const commendBeforeParse = ctx.message.text.trim().toLowerCase();
    const commandParser = (
      msg: string
    ): { command: string; username: string } | null => {
      const match = msg.match(/^(.*?)(?:\s+@(\w+))$/);
      if (!match) return null;

      return {
        command: match[1].trim(),
        username: match[2],
      };
    };
    const parsedCommand = commandParser(commendBeforeParse);
    if (parsedCommand?.command) {
      let targetUserId: number | undefined;
      if (parsedCommand?.username) {
        try {
          const chat = await bot.telegram.getChat(`@${parsedCommand.username}`);
          targetUserId = chat.id;
        } catch {
          await ctx.reply("یوزرنیم معتبر نیست یا قابل دسترسی نیست.");
          return;
        }
      } else {
        targetUserId = ctx.message.reply_to_message?.from?.id;
      }
      const targetUsername =
        parsedCommand?.username ||
        ctx.message.reply_to_message?.from?.username ||
        ctx.message.reply_to_message?.from?.first_name ||
        "کاربر";
      const commends =
        [
          { keys: ["ban", "kick", "بن", "سیک"], handler: banHandler },
          { keys: ["unban", "unkick", "حذف بن"], handler: unBanHandler },
          { keys: ["silent", "خفه", "سکوت"], handler: silentHandler },
          { keys: ["unsilent", "حذف خفه", "حذف سکوت"], handler: unSilentHandler },
        ]
      function matchCommand(command: string | undefined, keys: string[]) {
        if (!command) return false;
        return keys.includes(command);
      }

      if (!targetUserId) {
        await ctx.reply("یا روی پیام کاربر ریپلای کن یا یوزرنیم بده.");
        return;
      }
      if (targetUserId === userId) {
        await ctx.reply("نمی‌تونی روی خودت این دستور رو اجرا کنی.");
        return;
      }



      for (const cmd of commends) {
        if (matchCommand(parsedCommand?.command, cmd.keys)) {
          await cmd.handler({
            chatId,
            userId,
            targetUserId: targetUserId!,
            targetUsername,
            ctx,
          });
          return;
        }
      }

    }

  } await next();
});
