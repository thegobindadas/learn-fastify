import mongoose, { Schema } from "mongoose";


const thumbnailSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  videoName: { type: String, required: true },
  version: { type: String },
  image: { type: String, required: true },
  paid: { type: String, default: false },
});



export const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);