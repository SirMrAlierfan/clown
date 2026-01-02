import { ban } from "@/database/models/banList";
import { NickName } from "@/database/models/nickNameList";
import { promote } from "@/database/models/promotedList";
import { silent } from "@/database/models/silentList";
import { specialList } from "@/database/models/speciaUsersList";

export async function isBanned(
  userId: number,
  chatId: number,
): Promise<boolean> {
  const is = await ban.exists({ userId, chatId });
  return is ? true : false;
}
export async function isSilent(
  userId: number,
  chatId: number,
): Promise<boolean> {
  const is = await silent.exists({ userId, chatId });
  return is ? true : false;
}
export async function isPromoted(
  userId: number,
  chatId: number,
): Promise<boolean> {
  const is = await promote.exists({ userId, chatId });
  return is ? true : false;
}
export async function doesHaveNickName(
  userId: number,
  chatId: number,
): Promise<boolean> {
  const is = await NickName.exists({ userId, chatId });
  return is ? true : false;
}
export async function isSpecialUser(
  userId: number,
  chatId: number,
): Promise<boolean> {
  const is = await specialList.exists({ userId, chatId });
  return is ? true : false;
}
