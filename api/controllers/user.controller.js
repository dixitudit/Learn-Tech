import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import  User  from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "api works" });
};

export const updateUser = async (req, res, next) => {
  console.log(req.user);
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Access Denied"));
  } 
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password should be atleast 6 characters long")
      );
    }
    req.body.password = await bcryptjs.hashSync(req.body.password, 10);
  }
 
  if (req.body.username) {
    if (req.body.username.length < 3 || req.body.username.length > 20) {
      return next(
        errorHandler(
          400,
          "Username should be atleast 3 characters long and atmost 20 characters long"
        )
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username should not contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username should be in lowercase"));
    }
    if (req.body.username.match(/[^a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username should contain only alphabets and numbers")
      );
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePic: req.body.profilePic,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (err) {
      return next(errorHandler(400, "Username already exists"));
    }
  }
};
