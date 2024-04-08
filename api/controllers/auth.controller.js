import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  const hashedPass = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPass,
  });
  try {
    await newUser.save();
    res.json({ success: true, message: "signup successful" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email === "" || !password || password === "") {
    return next(errorHandler(400, "Username or Password is missing"));
  }
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(400, "Wrong Credentials"));
    }
    const isValidPassword = bcryptjs.compareSync(password, validUser.password);
    if (!isValidPassword) {
      return next(errorHandler(400, "Wrong Credentials"));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SE
    );
    // console.log(JSON.stringify(validUser));
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ user: rest, success: true });
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoURL } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // if the user already exists, just sign in
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SE
      );
      const { password: pass, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      // if the user doesn't exist, create a new user with random password and random username
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPass = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: name.toLowerCase().replace(' ','') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPass,
        profilePic: googlePhotoURL,
      });
      await newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SE
      );
      const { password: pass, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (err) {
    return next(err);
  }
};
