import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
 
  chatId: {
    type: Number,
    required: true,
  },
  AddedBy: {
    type: Number,
    
  },
  AddedAt: {
    type: Date,
    default: Date.now,
  },
});

groupSchema.index({ userId: 1, chatId: 1 }, { unique: true });
export const group = mongoose.model("Group", groupSchema);
