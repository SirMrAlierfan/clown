import { ChatMemberAdministrator } from "telegraf/types";
import { isPromoted, isSpecialUser } from "./managerHandlers/cheeker";

const adminCache = new Map<number, { time: number; admins: number[] }>();
const TTL = 60_000;

export async function canManage(ctx: any, chatId: number, userId: number) {
  const cached = adminCache.get(chatId);

  if (!cached || Date.now() - cached.time > TTL) {
    const admins: ChatMemberAdministrator[] = await ctx.getChatAdministrators();
    adminCache.set(chatId, {
      time: Date.now(),
      admins: admins.map(a => a.user.id),
    });
  }

  if (adminCache.get(chatId)!.admins.includes(userId)) return true;

  return await isPromoted(userId, chatId);
}


export async function protectAdmins(
  ctx: any,
  targetUserId: number,
  chatId: number
) {
  if (
    await isPromoted(targetUserId, chatId) ||
    await isSpecialUser(targetUserId, chatId)
  ) {
    await ctx.reply("نمی‌تونی روی ادمین یا کاربر ویژه این دستور رو اجرا کنی.");
    return false;
  }
  return true;
}
