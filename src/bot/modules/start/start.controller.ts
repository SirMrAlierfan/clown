import { bot } from "../bot";

bot.action("gap",(ctx)=>{
    ctx.reply("https://t.me/joinchat/qc6GaSXlxktmMDA0")
})
bot.action("pvMsg",(ctx)=>{
    ctx.answerCbQuery()
    ctx.reply("write your msg")
})
