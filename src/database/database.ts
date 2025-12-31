
import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGOURI) {
    throw new Error("MONGOURI not defined");
  }

  await mongoose.connect(process.env.MONGOURI);
  isConnected = true;
  console.log("MongoDB Connected");
}
