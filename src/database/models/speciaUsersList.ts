import mongoose from "mongoose";

const specialUsersSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  chatId: {
    type: Number,
    required: true,
  },
  specialedtBy: {
    type: Number,
    required: true,
  },
  specialedAt: {
    type: Date,
    default: Date.now,
  },
});

specialUsersSchema.index({ userId: 1, chatId: 1 }, { unique: true });
export const specialList = mongoose.model("specialUsers", specialUsersSchema);
