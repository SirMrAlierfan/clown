import { CommandContext } from "./types";

export interface CommandDef {
  keys: string[];
  type: "USER" | "MESSAGE";
  handler: (data: CommandContext) => Promise<void>;
}

export async function runCommand(
  ctx: any,
  commands: CommandDef[],
  data: CommandContext
) {
  const text = ctx.message.text.trim().toLowerCase();
  const command = text.split(/\s+/)[0];

  const cmd = commands.find(c => c.keys.includes(command));
  if (!cmd) return false;

  if (cmd.type === "USER" && !data.targetUserId) {
    await ctx.reply("روی پیام کاربر ریپلای کن یا یوزرنیم بده.");
    return true;
  }

  if (cmd.type === "MESSAGE" && !ctx.message.reply_to_message) {
    await ctx.reply("باید روی پیام ریپلای کنی.");
    return true;
  }
  console.log("COMMAND:", command);
  console.log("FOUND:", !!cmd);

  await cmd.handler(data);
  return true;
}
