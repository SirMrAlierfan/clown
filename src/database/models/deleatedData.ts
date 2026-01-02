import mongoose from "mongoose";

const delListSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
  },
  delBy: {
    type: Number,
  },
  delAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: String,
    wasOn: Number,
    required: true,
  },
});

delListSchema.index({ userId: 1, chatId: 1 }, { unique: true });
export const delList = mongoose.model("delList", delListSchema);
