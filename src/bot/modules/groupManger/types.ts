export interface CommandContext {
  chatId: number;
  userId: number;
  targetUserId?: number;
  targetUsername?: string;
  ctx: any;
  options?: {
    nickName?: string;
    duration?: number;
  };
}
export type CommandHandler = (data: CommandContext) => Promise<void>;