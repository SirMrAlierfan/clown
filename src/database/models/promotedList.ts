import mongoose from "mongoose";

const promotedSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  chatId: {
    type: Number,
    required: true,
  },
  PromotedtBy: {
    type: Number,
    
  },
  promotedAt: {
    type: Date,
    default: Date.now,
  },
});

promotedSchema.index({ userId: 1, chatId: 1 }, { unique: true });
export const promote = mongoose.model("Promoted", promotedSchema);
