import { ban } from "@/database/models/banList";
import { bot } from "../bot";
import { silent } from "@/database/models/silentList";
import { promote } from "@/database/models/promotedList";
import { NickName } from "@/database/models/nickNameList";
import { Composer, Markup } from "telegraf";
export const listComposer = new Composer()
listComposer.on("text", async (ctx, next) => {
    const userId: number = ctx.from.id;
    const chatId = ctx.chat.id;
    const adminList = await ctx.getChatAdministrators();
    const isAdmin: boolean = adminList.some(admin => admin.user.id === userId);

    if (!isAdmin) return;
    const messageText: string = ctx.message.text.trim().toLowerCase()
    switch (messageText) {
        case "list": case "لیست":
            ctx.reply("کدام لیست", Markup.inlineKeyboard(
                [[{ text: "بن", callback_data: "banlist" }],
                [{ text: "سکوت", callback_data: "silentlist" }],
                [{ text: "ادمین", callback_data: "adminlist" }]
                ]
            )
            )
    }
    await next()
})
listComposer.on("callback_query", async (ctx) => {
    const userId: number = ctx.from.id;
    if (!ctx.chat?.id) return
    const chatId = ctx.chat.id;
    if (!("data" in ctx.callbackQuery)) return;
    const data = ctx.callbackQuery.data
    if (data)
        switch (data) {
            case "banlist":
                const banData = await ban.find({ chatId }).lean().limit(20)
                await ctx.editMessageText(banData.map(item => `${item.userId} در ${new Date(item.bannedAt).toLocaleString()} توسط ${item.BannedBy}\n`).join(""))
                break;
            case "silentlist":
                const silentData = await silent.find({ chatId }).lean().limit(20)
                await ctx.editMessageText(silentData.map(item => `${item.userId} در ${new Date(item.silentedAt).toLocaleString()} توسط ${item.silentBy}\n`).join(""))
                break;
            case "adminlist":
                const adminData = await promote.find({ chatId }).lean().limit(20)
                await ctx.editMessageText(adminData.map(item => `${item.userId} در ${new Date(item.promotedAt).toLocaleString()} توسط ${item.PromotedtBy}\n`).join(""))
                break;
            default:
                break
        }

})