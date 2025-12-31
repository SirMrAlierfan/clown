import { ban } from "@/database/models/banList";
import { bot } from "../bot";
import { silent } from "@/database/models/silentList";
import { promote } from "@/database/models/promotedList";
import { NickName } from "@/database/models/nickNameList";



bot.on("text", async (ctx) => {
  const userId: number = ctx.from.id;
  const adminList = await ctx.getChatAdministrators();
  const isAdmin: boolean = adminList.some(admin => admin.user.id === userId);
  if (!isAdmin) return;
  if (!ctx.message.reply_to_message?.from?.id) return;
  const originalUserId = ctx.message.reply_to_message.from.id;
  const originalUsername = ctx.message.reply_to_message.from.username || ctx.message.reply_to_message.from.first_name;
  const messageText: string = ctx.message.text.trim().toLowerCase();
  const parts: string[] = messageText.split(" ")

  const chatId = ctx.chat.id;
  const isBan = await ban.exists({ userId: originalUserId, chatId })
  const isSilent = await silent.exists({ userId: originalUserId, chatId })
  const isPromoted = await promote.exists({ userId: originalUserId, chatId })
  const doesHaveNickName = await NickName.exists({ userId: originalUserId, chatId })
  const nickName = await NickName.findOne({ userId: originalUserId, chatId })
  const commend = parts[0]
  switch (commend) {
    case "id": case "ایدی": case "آیدی":
      await ctx.reply(`کاربر ${originalUsername}\n ${isPromoted ? "ادیمن" : "عضو عادی گروه"} \n ${doesHaveNickName ? `لقب :${nickName?.name}` : "بی لقب"}`)
      break
    case "ban": case "بن": case "سیک":
      if (isBan) {
        ctx.reply("همین الانش بنه")

      }
      else {
        await bot.telegram.banChatMember(chatId, originalUserId);
        await ctx.reply(`کاربر @${originalUsername} بن شد.`);
        await ban.updateOne({ userId: originalUserId, chatId }, { $set: { BannedBy: userId, bannedAt: Date.now() } }, { upsert: true })
        break;
      }
    case "unban": case "حذف بن":
      if (!isBan) {
        ctx.reply("همین الانشم آزاده")

      } else {
        await bot.telegram.unbanChatMember(chatId, originalUserId);
        await ctx.reply(`کاربر @${originalUsername} آزاد شد.`);
        await ban.deleteOne({ userId: originalUserId, chatId })
        break;
      }
    case "silent": case "سایلنت": case "خفه": case "سکوت":
      if (isSilent) {
        await ctx.reply("همین الانشم سکوته");
        break;
      }

      
      let durationStr = parts[1] || "5m"; 
      let durationMs = 0;

      if (durationStr.endsWith("s") || durationStr.endsWith("sec") || durationStr.endsWith("ثانیه")) {
        durationMs = parseInt(durationStr) * 1000;
      } else if (durationStr.endsWith("m") || durationStr.endsWith("min") || durationStr.endsWith("دقیقه")) {
        durationMs = parseInt(durationStr) * 60 * 1000;
      } else if (durationStr.endsWith("h") || durationStr.endsWith("hour") || durationStr.endsWith("ساعت")) {
        durationMs = parseInt(durationStr) * 60 * 60 * 1000;
      } else {
        
        durationMs = parseInt(durationStr) * 60 * 1000;
      }

      const until = new Date(Date.now() + durationMs);
      const untilTimestamp = Math.floor(until.getTime() / 1000);

      await silent.updateOne(
        { userId: originalUserId, chatId },
        { $set: { silentBy: userId, until, silentedAt: Date.now() } },
        { upsert: true }
      );

      await bot.telegram.restrictChatMember(chatId, originalUserId, {
        until_date: untilTimestamp,
        permissions: {
          can_send_messages: false,
          can_send_polls: false,
          can_send_other_messages: false,
          can_add_web_page_previews: false,
        }
      });

      await ctx.reply(`کاربر @${originalUsername} تا ${until.toLocaleString()} سایلنت شد.`);
      break;



    case "unsilent": case "حذف سکوت":
      if (!isSilent) {
        ctx.reply("همین الانشم سکوت نیست")

      } else {
        silent.deleteOne({ userId: originalUserId, chatId })
        await bot.telegram.restrictChatMember(chatId, originalUserId, {
          until_date: 0,
          permissions: {
            can_send_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true
          }
        });
        await ctx.reply(`کاربر @${originalUsername} می‌تواند دوباره پیام ارسال کند.`);
        break;
      }

    case "promote": case "ترفیع": case "تنظیم مدیر":
      if (isPromoted) {
        ctx.reply(`همین حالا مدیر است `)

      }
      else {
        promote.updateOne({ userId: originalUserId, chatId }, { $set: { PromotedtBy: userId, promotedAt: Date.now() } }, { upsert: true })
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


        break
      }
    case "unpromote": case "عزل": case "حذف مدیر":
      if (!isPromoted) {
        ctx.reply("همین الانشم مدیر نیست")

      }
      else {
        promote.deleteOne({ userId: originalUserId, chatId })
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
      }
    case "setnickname": case "تنظیم لقب":
      const userNickname = messageText.replace(/^(تنظیم لقب|setnickname)\s*/, "");

      await NickName.updateOne({ userId: originalUserId, chatId }, { $set: { name: userNickname } }, { upsert: true })
      ctx.reply(`لفب کاربر به ${userNickname} تغییر یافت`)
      break
    case "nickname": case "لقب":
      const gettedNickname = await NickName.findOne({ userId: originalUserId, chatId })
      ctx.reply(`لقب کاربر : ${gettedNickname?.name}`)
      break
    case "delnickname": case "حذف لقب":

      await NickName.deleteOne({ userId: originalUserId, chatId })
    
      ctx.reply(`لقب کاربر حذف شد`)
      break
    case "pin": case "پین":
      await bot.telegram.pinChatMessage(chatId, ctx.message.reply_to_message.message_id)
      ctx.reply(`پیام پین شد`)
      break
    case "unpin": case "حذف پین":
      await bot.telegram.unpinChatMessage(chatId, ctx.message.reply_to_message.message_id)
      ctx.reply(`پیام از پین درآمد`)
      break
    case "del": case "حذف":
      await bot.telegram.deleteMessage(chatId, ctx.message.reply_to_message.message_id)
      ctx.reply(`پیام حذف شد`)
      break
    default:
      break;
  }
});
