import { connectDB } from "./database";

export async function ensureDB() {
  await connectDB();
}
