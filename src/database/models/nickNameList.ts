import mongoose from "mongoose";

const nickNameSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  chatId: {
    type: Number,
    required: true
  },
  name:{
    type: String,
    require:true
  },
  namedtBy: {
    type: Number, // admin id
    required: true
  },
  namedAt: {
    type: Date,
    default: Date.now
  }
});


nickNameSchema.index({ userId: 1, chatId: 1 }, { unique: true });
export const NickName = mongoose.model("NickName", nickNameSchema);
