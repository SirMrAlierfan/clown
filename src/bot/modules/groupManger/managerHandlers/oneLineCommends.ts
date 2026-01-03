
import { bot } from "../../bot";
import type { CommandHandler } from "../manger.handler";
import { isPromoted, isSpecialUser } from "./cheeker";

export const deleatMsgHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {
    await ctx.deleteMessage({ chatId, messageId: ctx.message?.reply_to_message?.message_id! });
    await ctx.reply(
        ` حذف شد.`,
        { parse_mode: "HTML" },
    );
};

export const pinMsgHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {
    await ctx.pinChatMessage({ chatId, messageId: ctx.message?.reply_to_message?.message_id! });
    await ctx.reply(
        ` پین شد.`,
        { parse_mode: "HTML" },
    );
};

export const unPinMsgHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {
    await ctx.unpinChatMessage({ chatId, messageId: ctx.message?.reply_to_message?.message_id! });
    await ctx.reply(
        ` از پین خارج شد.`,
        { parse_mode: "HTML" },
    );
};
export const idHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {

    await ctx.reply(
        `آیدی کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a> : <b>${targetUserId}</b>\n مقام کاربر ${await isPromoted(targetUserId, chatId) ? "ادمین" : await isSpecialUser(targetUserId, chatId) ? "ویژه" : "عادی"} \n آیدی گروه : <b>${chatId}</b>`,
        { parse_mode: "HTML" },
    );
};