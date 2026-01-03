
import { specialList } from "@/database/models/speciaUsersList";
import { bot } from "../../bot";
import type { CommandHandler } from "../types";

export const addSpecialHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {
  
    
    const exists = await specialList.findOne({ userId: targetUserId, chatId });
    if (exists) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a> همین الانشم ویژه هست.`,
            { parse_mode: "HTML" },
        );
        return;
    }

    await specialList.updateOne(
        { userId: targetUserId, chatId },
        { $set: { addedBy: userId, addedAt: Date.now() } },
        { upsert: true }
    );

    await ctx.reply(
        `<a href="tg://user?id=${targetUserId}">${targetUsername}</a> اکنون کاربر ویژه شد.`,
        { parse_mode: "HTML" },
    );
};

export const removeSpecialHandler: CommandHandler = async ({ chatId, userId, targetUserId, targetUsername, ctx }) => {
 

    const exists = await specialList.findOne({ userId: targetUserId, chatId });
    if (!exists) {
        await ctx.reply(
            `کاربر <a href="tg://user?id=${targetUserId}">${targetUsername}</a> همین الانشم ویژه نیست.`,
            { parse_mode: "HTML" },
        );
        return;
    }

    await specialList.deleteOne({ userId: targetUserId, chatId });

    await ctx.reply(
        `<a href="tg://user?id=${targetUserId}">${targetUsername}</a> اکنون از وضعیت ویژه خارج شد.`,
        { parse_mode: "HTML" },
    );
};
