import mongoose from "mongoose";
const { model, models, Schema } = mongoose;

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    img: { type: String },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Post = models?.post || model("post", postSchema);

export default Post