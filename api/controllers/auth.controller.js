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
      .json({...rest,  success: true });
  } catch (err) {
    next(err);
  }
};
