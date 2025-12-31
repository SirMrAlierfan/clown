import mongoose from "mongoose";

const banSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  chatId: {
    type: Number,
    required: true
  },
  BannedBy: {
    type: Number
  },
  bannedAt: {
    type: Date,
    default: Date.now
  }
});


banSchema.index({ userId: 1, chatId: 1 }, { unique: true });
export const ban = mongoose.model("Ban", banSchema);
