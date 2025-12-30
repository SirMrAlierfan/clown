import { bot } from '@/bot/modules/bot';

bot.hears("hi", (ctx) => ctx.reply("hi"));

bot.on("text", async (ctx) => {
  const messageText = ctx.message.text.toLowerCase();
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;

  const adminList = await ctx.getChatAdministrators();
  const isAdmin = adminList.some(admin => admin.user.id === userId);
  if (!isAdmin) return;

  if (ctx.message.reply_to_message?.from?.id) {
    const originalUserId = ctx.message.reply_to_message.from.id;
    const originalUsername = ctx.message.reply_to_message.from.username || ctx.message.reply_to_message.from.first_name;

    switch (messageText) {
      case "ban":
        await bot.telegram.banChatMember(chatId, originalUserId);
        await ctx.reply(`User @${originalUsername} got banned`);
        break;

      case "silent":
        await bot.telegram.restrictChatMember(chatId, originalUserId, {
          permissions: {
            can_send_messages: false,

            can_send_polls: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false
          }
        });
        await ctx.reply(`User @${originalUsername} is now silent`);
        break;

      case "unban":
        await bot.telegram.unbanChatMember(chatId, originalUserId);
        await ctx.reply(`User @${originalUsername} is now free`);
        break;

      case "unsilent":
        await bot.telegram.restrictChatMember(chatId, originalUserId, {
          permissions: {
            can_send_messages: true,

            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true
          }
        });
        await ctx.reply(`User @${originalUsername} can now send messages`);
        break;

      default:
        break;
    }
  }
});
