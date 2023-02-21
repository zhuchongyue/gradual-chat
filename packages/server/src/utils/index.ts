
import mongoose from "mongoose";

export function wrapObjectId(id: string) {
  return new mongoose.Types.ObjectId(id)
}