import { time } from "console";
import mongoose from "mongoose";

const silentSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  chatId: {
    type: Number,
    required: true
  },
  silentBy: {
    type: Number, 
    required: true
  },
  until:{
    time:Number  
  },
  silentedAt: {
    type: Date,
    default: Date.now
  }
});


silentSchema.index({ userId: 1, chatId: 1 }, { unique: true });
export const silent = mongoose.model("Silent", silentSchema);
