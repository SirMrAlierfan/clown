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
import { isPromoted, isSpecialUser } from "./managerHandlers/cheeker";
import { group } from "@/database/models/groupList";
import { demoteHandler, promoteHandler } from "./managerHandlers/promote";
import { addSpecialHandler, removeSpecialHandler } from "./managerHandlers/specialUser";
import { deleatMsgHandler, deleatMsgHandler, idHandler, pinMsgHandler, unPinMsgHandler } from "./managerHandlers/oneLineCommends";

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
    const owner = await bot.telegram.getChatAdministrators(chatId).then(admins => admins.find(a => a.status === "creator"));
    await bot.telegram.sendMessage(chat.id, "سلام! ربات با موفقیت به گروه اضافه شد ✅");
    group.updateOne(
      { chatId },
      { $set: { addedAt: Date.now(), AddedBy: owner?.user.id || new_chat_member.user.id } },
      { upsert: true }
    );

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

  if (
    (old_chat_member.status === "member" ||
      old_chat_member.status === "administrator") &&
    (new_chat_member.status === "left" ||
      new_chat_member.status === "kicked")
  ) {
    const chatId = chat.id;
    await Promise.all([
      ban.deleteMany({ chatId }),
      silent.deleteMany({ chatId }),
      promote.deleteMany({ chatId }),
      NickName.deleteMany({ chatId }),
    ]);
    group.deleteOne({ chatId });
    console.log(`🧹 Bot removed from chat ${chatId}, data cleaned.`);
  }
});

managerComposer.on("text", async (ctx, next) => {
  await ensureDB()
  const chatId = ctx.chat.id;
  const userId: number = ctx.from.id;
  const admins = await ctx.getChatAdministrators();
  const isAdmin = admins.some(a => a.user.id === userId);
  if (await isPromoted(userId, chatId)) {

    const commendBeforeParse = ctx.message.text.trim().toLowerCase();
    interface ParsedCommand {
      command: string;
      args: string[];
    }

    function commandParser(text: string): ParsedCommand | null {
      if (!text) return null;

      const parts = text.trim().split(/\s+/);
      return {
        command: parts[0],
        args: parts.slice(1),
      };
    }

    const parsedCommand = commandParser(commendBeforeParse);
    if (parsedCommand?.command) {
      let targetUserId: number | undefined;
      let targetUsername = "کاربر";


      if (ctx.message.reply_to_message?.from) {
        targetUserId = ctx.message.reply_to_message.from.id;
        targetUsername =
          ctx.message.reply_to_message.from.username ||
          ctx.message.reply_to_message.from.first_name;
      }


      if (ctx.message.entities) {
        const mentionEntity = ctx.message.entities.find(e => e.type === "text_mention");
        if (mentionEntity && "user" in mentionEntity) {
          targetUserId = mentionEntity.user.id;
          targetUsername = mentionEntity.user.username || mentionEntity.user.first_name;
        } else {
          const usernameEntity = ctx.message.entities.find(e => e.type === "mention");
          if (usernameEntity) {
            const username = ctx.message.text.slice(usernameEntity.offset + 1, usernameEntity.offset + usernameEntity.length); // حذف @
            try {
              const userChat = await ctx.telegram.getChat(`@${username}`);
              targetUserId = userChat.id;
              targetUsername = username
            } catch (err) {
              await ctx.reply("نمی‌توانم کاربر را پیدا کنم. شاید هنوز با ربات تعامل نکرده باشد.");
            }

          }
        }
      }




      const commends =
        [
          { keys: ["ban", "kick", "بن", "سیک"], handler: banHandler },
          { keys: ["unban", "unkick", "حذف بن"], handler: unBanHandler },
          { keys: ["silent", "خفه", "سکوت"], handler: silentHandler },
          { keys: ["unsilent", "حذف خفه", "حذف سکوت"], handler: unSilentHandler },
          , { keys: ["promote", "ادمین"], handler: promoteHandler },
          , { keys: ["demote", "حذف ادمین"], handler: demoteHandler },
          , { keys: ["addspecial", "ویژه"], handler: addSpecialHandler },
          , { keys: ["removespecial", "حذف ویژه"], handler: removeSpecialHandler },
          , { keys: ["id", "آیدی", "ایدی"], handler: idHandler },
          { keys: ["del", "حذف"], handler: deleatMsgHandler },
          { keys: ["pin", "پین"], handler: pinMsgHandler },
          { keys: ["unpin", "حذف پین"], handler: unPinMsgHandler },
        ]
      function matchCommand(command: string | undefined, keys: string[]) {
        if (!command) return false;
        return keys.includes(command);
      }

      if (!targetUserId && parsedCommand.command) {
        await ctx.reply("یا روی پیام کاربر ریپلای کن یا یوزرنیم بده.");
        return;
      }
      if (targetUserId === userId) {
        await ctx.reply("نمی‌تونی روی خودت این دستور رو اجرا کنی.");
        return;
      }
      const restrictedCommands = ["ban", "kick", "بن", "سیک", "silent", "خفه", "سکوت"];

      if (restrictedCommands.includes(parsedCommand.command)) {
        const targetIsPromoted = await isPromoted(targetUserId, chatId);
        const targetIsSpecial = await isSpecialUser(targetUserId, chatId);

        if (targetIsPromoted || targetIsSpecial) {
          await ctx.reply(
            `نمی‌تونی روی ادمین‌ها یا کاربران ویژه این دستور رو اجرا کنی.`,
            { parse_mode: "HTML" },
          );
          return;
        }
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

    await next();
  }
});
