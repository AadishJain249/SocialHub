const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    likes: [{ type: String }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: "Comments" }],
  },
  { timestamps: true }
);
const Posts = mongoose.model("Posts", postSchema);
module.exports=Posts;
