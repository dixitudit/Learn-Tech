import { mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "https://firebasestorage.googleapis.com/v0/b/learn-tech-ef5c2.appspot.com/o/PlaceholderImage.jpg?alt=media&token=01f99222-5005-455d-9ec1-4007de96fdce",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    }

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
 