import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (process.env.MONGOURI)
      await mongoose.connect(process.env.MONGOURI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err);
    process.exit(1);
  }
}
