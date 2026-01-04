import { CommandHandler } from "../types.js";

export const deleteMsg: CommandHandler = async ({ ctx }) => {
  try {
    const chatId = ctx.chat.id;
    const msg = ctx.message.reply_to_message;

    if (!msg) {
      await ctx.reply("باید روی پیام ریپلای کنی.");
      return;
    }

    await ctx.telegram.deleteMessage(chatId, msg.message_id);

    
    await ctx.telegram.deleteMessage(chatId, ctx.message.message_id);

  } catch (err: any) {
    if (err?.response?.error_code === 400) {
      await ctx.reply("نمی‌تونم این پیام رو حذف کنم (یا قبلاً حذف شده یا دسترسی ندارم).");
    } else if (err?.response?.error_code === 403) {
      await ctx.reply("ربات دسترسی حذف پیام رو نداره.");
    } else {
      console.error(err);
      await ctx.reply("خطای ناشناخته رخ داد.");
    }
  }
};


export const pinMsg: CommandHandler = async ({ ctx, chatId }) => {
  await ctx.telegram.pinChatMessage(
    chatId,
    ctx.message.reply_to_message.message_id
  );
};

export const unpinMsg: CommandHandler = async ({ ctx, chatId }) => {
  await ctx.telegram.unpinChatMessage(chatId);
};

export const idInfo: CommandHandler = async ({
  ctx,
  chatId,
  targetUserId,
  targetUsername,
}) => {
  await ctx.reply(
    `👤 ${targetUsername}\n🆔 ${targetUserId}\n🏠 ${chatId}`,
    { parse_mode: "HTML" }
  );
};
