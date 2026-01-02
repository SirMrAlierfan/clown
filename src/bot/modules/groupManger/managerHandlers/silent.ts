import { ban } from "@/database/models/banList";
import { bot } from "../../bot";
import type { CommandHandler } from "../manger.handler";
import { isBanned, isPromoted, isSilent, isSpecialUser } from "./cheeker";

export const silentHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {

    if (!ctx.message?.reply_to_message?.from?.id) {
        await ctx.reply("این دستور باید روی پیام یک کاربر ریپلای شود.");
        return;
    }

    if (await isSilent(targetUserId, chatId)) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a>همین الانشم سکوته`,
            { parse_mode: "HTML" },
        );
    } else if (await isPromoted(targetUserId, chatId)) {
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a>ادمین هست و نمیشه سکوتش کرد`,
            { parse_mode: "HTML" },
        );
    } else if (await isSpecialUser(targetUserId, chatId)) {
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a>کاربر ویژه هست و نمیشه سکوتش کرد`,
            { parse_mode: "HTML" },
        );
    } else {
        await bot.telegram.banChatMember(chatId, targetUserId);
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a>بن شد.`,
            { parse_mode: "HTML" },
        );
        await ban.updateOne(
            { userId: targetUserId, chatId },
            { $set: { BannedBy: userId, bannedAt: Date.now() } },
            { upsert: true },
        );
    }
};
export const unSilentHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {


    if (!(await isBanned(targetUserId, chatId))) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a>همین الانشم بن نیست.`,
            { parse_mode: "HTML" },
        );
    } else {
        await bot.telegram.unbanChatMember(chatId, targetUserId);
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a>ازاد شد.`,
            { parse_mode: "HTML" },
        );
        await ban.deleteOne({ userId: targetUserId, chatId });
    }
};
