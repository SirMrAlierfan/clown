import { silent } from "@/database/models/silentList";
import { bot } from "../../bot";
import type { CommandHandler } from "../types";
import { isSilent, isPromoted, isSpecialUser } from "./cheeker";

export const silentHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {


 if (!targetUserId) {
        await ctx.reply("لطفا یک کاربر را هدف قرار دهید.");
        return;
    }
    if (await isSilent(targetUserId, chatId)) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a> همین الانشم سکوته.`,
            { parse_mode: "HTML" },
        );
    } else if (await isPromoted(targetUserId, chatId)) {
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a> ادمین هست و نمیشه سکوتش کرد.`,
            { parse_mode: "HTML" },
        );
    } else if (await isSpecialUser(targetUserId, chatId)) {
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a> کاربر ویژه هست و نمیشه سکوتش کرد.`,
            { parse_mode: "HTML" },
        );
    } else {
        await bot.telegram.restrictChatMember(chatId, targetUserId, {
            permissions: {
                can_send_messages: false,
                can_send_polls: false,
                can_send_other_messages: false,
                can_add_web_page_previews: false,
                can_change_info: false,
                can_invite_users: false,
                can_pin_messages: false,
            },
        });
        await silent.updateOne(
            { userId: targetUserId, chatId },
            { $set: { silencedBy: userId, silencedAt: Date.now() } },
            { upsert: true }
        );

        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a> اکنون ساکت شد.`,
            { parse_mode: "HTML" },
        );
    }
};

export const unSilentHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {
 if (!targetUserId) {
        await ctx.reply("لطفا یک کاربر را هدف قرار دهید.");
        return;
    }


    if (!(await isSilent(targetUserId, chatId))) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a> همین الانشم ساکت نیست.`,
            { parse_mode: "HTML" },
        );
    } else {
        await silent.deleteOne({ userId: targetUserId, chatId });
        await ctx.reply(
            `<a href="tg://user?id=${targetUserId}">${targetUsername}</a> از سکوت آزاد شد.`,
            { parse_mode: "HTML" },
        );
        await bot.telegram.restrictChatMember(chatId, targetUserId, {
            permissions: {
                can_send_messages: true,
                can_send_polls: true,
                can_send_other_messages: true,
                can_add_web_page_previews: true,
                can_change_info: false,
                can_invite_users: true,
                can_pin_messages: false,
            },
        });
    }
};
