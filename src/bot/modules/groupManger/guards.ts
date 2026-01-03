import { isPromoted, isSpecialUser } from "./managerHandlers/cheeker";


export async function canManage(ctx: any, chatId: number, userId: number) {
  const admins = await ctx.getChatAdministrators();
  const isAdmin = admins.some(a => a.user.id === userId);
  const isDbAdmin = await isPromoted(userId, chatId);
  return isAdmin || isDbAdmin;
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
