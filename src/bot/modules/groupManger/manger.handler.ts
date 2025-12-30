import { Markup } from 'telegraf';
import { bot } from '@/bot/modules/bot';


bot.on("text", async (ctx) => {
  const messageText = ctx.message.text;
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;
  const adminList = await ctx.getChatAdministrators()
  const isAdmin = adminList.some(admin => admin.user.id === userId);
  bot.hears("hi",(ctx)=>{
    ctx.sendMessage("hi")
  })
  if (isAdmin) {
    if (ctx.message.reply_to_message) {
      if (ctx.message.reply_to_message.from?.id) {
        const originalUserId = ctx.message.reply_to_message.from.id;
        const originalUsername = ctx.message.reply_to_message.from.username || ctx.message.reply_to_message.from.first_name;
        switch (messageText) {
          
          case "ban":
            bot.telegram.banChatMember(chatId, originalUserId)
            bot.telegram.sendMessage(chatId, `user ${originalUsername} got banned`); break
          case "silent":
            bot.telegram.restrictChatMember(chatId, originalUserId, {
              permissions: {
                can_send_messages: false,
              }
            })
            break
          case "unban":
            bot.telegram.unbanChatMember(chatId, originalUserId)
            bot.telegram.sendMessage(chatId, `user ${originalUsername} is now free`); break
          case "unsilent":
            bot.telegram.restrictChatMember(chatId, originalUserId, {
              permissions: {
                can_send_messages: true
              }
            })
            break
            default:
              break
        }
      }



    }


  }
  else {
    return
  }
})