import { bot } from "../bot";


bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const adminList = await ctx.getChatAdministrators();
  const isAdmin = adminList.some(admin => admin.user.id === userId);
  const messageText = ctx.message.text.trim().toLowerCase();
  const chatId = ctx.chat.id;


  if (!isAdmin) return;
  if (!ctx.message.reply_to_message?.from?.id) return;

  const originalUserId = ctx.message.reply_to_message.from.id;
  const originalUsername = ctx.message.reply_to_message.from.username || ctx.message.reply_to_message.from.first_name;

  switch (messageText) {
    case "ban":
    case "بن":
      await bot.telegram.banChatMember(chatId, originalUserId);
      await ctx.reply(`کاربر @${originalUsername} بن شد.`);
      break;

    case "silent":
    case "سایلنت":
      await bot.telegram.restrictChatMember(chatId, originalUserId, {
        permissions: {
          can_send_messages: false,
          can_send_polls: false,
          can_send_other_messages: false,
          can_add_web_page_previews: false
        }
      });
      await ctx.reply(`کاربر @${originalUsername} سایلنت شد.`);
      break;

    case "unban":
    case "آزاد":
      await bot.telegram.unbanChatMember(chatId, originalUserId);
      await ctx.reply(`کاربر @${originalUsername} آزاد شد.`);
      break;

    case "unsilent":
    case "آن‌سایلنت":
      await bot.telegram.restrictChatMember(chatId, originalUserId, {
        permissions: {
          can_send_messages: true,
          can_send_polls: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true
        }
      });
      await ctx.reply(`کاربر @${originalUsername} می‌تواند دوباره پیام ارسال کند.`);
      break;

    default:
      break;
  }
});
