import { ban } from "@/database/models/banList";
import { bot } from "../../bot";
import type { CommandHandler } from "../manger.handler";
import { isBanned, isPromoted, isSpecialUser } from "./cheeker";

export const banHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {
    
    if (await isBanned(targetUserId, chatId)) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a>همین الانشم بن هست.`,
            { parse_mode: "HTML" },
        );
    } else if (await isPromoted(targetUserId, chatId)) {
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a>ادمین هست و نمیشه بنش کرد`,
            { parse_mode: "HTML" },
        );
    } else if (await isSpecialUser(targetUserId, chatId)) {
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a>کاربر ویژه هست و نمیشه بنش کرد`,
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
export const unBanHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername,  ctx }) => {

   
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
