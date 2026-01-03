import { CommandHandler } from "../types.js";

export const deleteMsg: CommandHandler = async ({ ctx, chatId }) => {
  await ctx.telegram.deleteMessage(
    chatId,
    ctx.message.reply_to_message.message_id
  );
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
