import { promote } from "@/database/models/promotedList";
import { bot } from "../../bot";
import type { CommandHandler } from "../manger.handler";
import { isPromoted, isSpecialUser } from "./cheeker";

export const promoteHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {

    if (await isPromoted(targetUserId, chatId)) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a> همین الانشم پروموت شده.`,
            { parse_mode: "HTML" },
        );
        return;
    }



    await promote.updateOne(
        { userId: targetUserId, chatId },
        { $set: { promotedBy: userId, promotedAt: Date.now() } },
        { upsert: true }
    );
    await ctx.telegram.promoteChatMember(chatId, targetUserId, {
        can_change_info: true,
        can_delete_messages: true,
        can_invite_users: true,
        can_restrict_members: true,
        can_pin_messages: true,
    });
    await ctx.reply(
        `<a href="tg://user?id=${targetUserId}">${targetUsername}</a> اکنون پروموت شد.`,
        { parse_mode: "HTML" },
    );
};

export const demoteHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {


    if (!(await isPromoted(targetUserId, chatId))) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a> همین الانشم ادمین نشده.`,
            { parse_mode: "HTML" },
        );
        return;
    }

    await promote.deleteOne({ userId: targetUserId, chatId });
    await ctx.telegram.promoteChatMember(chatId, targetUserId, {
        can_change_info: false,
        can_delete_messages: false,
        can_invite_users: false,
        can_restrict_members: false,
        can_pin_messages: false,
    });
    await ctx.reply(
        `<a href="tg://user?id=${targetUserId}">${targetUsername}</a> اکنون از ادمینی خارج شد.`,
        { parse_mode: "HTML" },
    );
};
