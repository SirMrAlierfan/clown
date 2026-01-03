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
import { deleteMsg, idInfo, pinMsg, unpinMsg } from "./managerHandlers/oneLineCommends";
import { canManage } from "./guards";
import { runCommand } from "./commend.router";

console.log("GROUP MANAGER LOADED");
 



export const managerComposer = new Composer();
managerComposer.on("my_chat_member", async (ctx) => {
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
  await ensureDB();

  const chatId = ctx.chat.id;
  const userId = ctx.from.id;

  if (!(await canManage(ctx, chatId, userId))) return next();

  let targetUserId: number | undefined;
  let targetUsername = "کاربر";

  if (ctx.message.reply_to_message?.from) {
    targetUserId = ctx.message.reply_to_message.from.id;
    targetUsername =
      ctx.message.reply_to_message.from.username ||
      ctx.message.reply_to_message.from.first_name;
  }

  const handled = await runCommand(
    ctx,
    [
      { keys: ["ban", "بن"], type: "USER", handler: banHandler },
      { keys: ["unban"], type: "USER", handler: unBanHandler },
      { keys: ["id", "ایدی"], type: "USER", handler:idInfo},     
      { keys: ["silent", "سکوت"], type: "USER", handler: silentHandler },
      { keys: ["unsilent", "حذف سکوت"], type: "USER", handler: unSilentHandler },
      { keys: ["promote", "پروموت"], type: "USER", handler: promoteHandler },
      { keys: ["demote", "حذف ادمین"], type: "USER", handler: demoteHandler },
      { keys: ["addspecial", "ویژه"], type: "USER", handler: addSpecialHandler },
      { keys: ["removespecial", "حذف ویژه"], type: "USER", handler: removeSpecialHandler },
      { keys: ["del", "حذف"], type: "MESSAGE", handler: deleteMsg },
      { keys: ["pin", "پین"], type: "MESSAGE", handler: pinMsg },
      { keys: ["unpin", "حذف پین"], type: "MESSAGE", handler: unpinMsg },
    ],
    {
      chatId,
      userId,
      targetUserId,
      targetUsername,
      ctx,
    }
  );

  if (!handled) await next();
});