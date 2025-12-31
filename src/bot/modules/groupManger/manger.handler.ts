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
    case "حذف بن":
      await bot.telegram.unbanChatMember(chatId, originalUserId);
      await ctx.reply(`کاربر @${originalUsername} آزاد شد.`);
      break;

    case "unsilent":
    case "حذف سکوت":
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

    case "promote":
    case "ترفیغ":
      if (isAdmin) {
        ctx.reply(`همین حالا مدیر است${originalUsername} `)
      }
      else {
        await bot.telegram.promoteChatMember(chatId, originalUserId, {
          can_change_info: true,
          can_delete_messages: true,
          can_edit_messages: true,
          can_manage_chat: true,
          can_invite_users: true,
          can_manage_topics: true,
          can_pin_messages: true,
          can_manage_video_chats: true,
          can_post_messages: true,
          can_restrict_members: true
        })
      }

      break
    case "unpromote":
    case "عزل":
      await bot.telegram.promoteChatMember(chatId, originalUserId, {
        can_change_info: false,
        can_delete_messages: false,
        can_edit_messages: false,
        can_manage_chat: false,
        can_invite_users: false,
        can_manage_topics: false,
        can_pin_messages: false,
        can_manage_video_chats: false,
        can_post_messages: false,
        can_restrict_members: false
      })
      ctx.reply(`کابر ${originalUsername}مدیر نیست`)
      break
    case "pin":
    case "پین":
      await bot.telegram.pinChatMessage(chatId, ctx.message.reply_to_message.message_id)
      ctx.reply(`پیام پین شد`)
      break
    case "unpin":
    case "حذف پین":
      await bot.telegram.unpinChatMessage(chatId, ctx.message.reply_to_message.message_id)
      ctx.reply(`پیام از پین درآمد`)
      break
    case "del":
    case "حذف":
      await bot.telegram.deleteMessage(chatId, ctx.message.reply_to_message.message_id)
      ctx.reply(`پیام حذف شد`)
      break
    default:
      break;
  }
});
