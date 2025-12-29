import { Telegraf } from "telegraf";


export function createKeyboard() {
   
  return {
    reply_markup: {
      keyboard: [
        [{ text: "Button 1" }],
        [{ text: "Button 2" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}
