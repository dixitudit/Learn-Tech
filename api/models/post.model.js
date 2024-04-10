import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/learn-tech-ef5c2.appspot.com/o/how-to-write-a-blog-post-1536x674.jpeg?alt=media&token=fc09f1c5-b548-4814-ad53-e80b6a534a9d",
  },
  category: {
    type: String,
    default: "uncategorised",
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });


const Post = mongoose.model("Post", postSchema);

export default Post;