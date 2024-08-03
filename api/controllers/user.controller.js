import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "api works" });
};

//update user
export const updateUser = async (req, res, next) => {
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
    return res.status(200).json(rest);
  } catch (err) {
    return next(errorHandler(400, "Username already exists"));
  }
};

// delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "Access Denied"));
    }
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// sign out user
export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.cookie("isTokenPresent", false);
    res.status(200).json({ message: "Signout successful" });
  } catch (err) {
    return next(err);
  }
};

// get users
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Access Denied"));
  }
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = (req.query.order === "asc") ? 1 : -1;
  try {
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res
      .status(200)
      .json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (err) {
    return next(err);
  }
};

// delete user by admin
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.delUserId);
    if (
      user.isAdmin ||
      !req.user.isAdmin ||
      req.user.id !== req.params.userId
    ) {
      return next(errorHandler(403, "Access Denied"));
    }
    await User.findByIdAndDelete(req.params.delUserId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//get user by id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const { email, password, ...rest } = user._doc;
    return res.status(200).json(rest);
  } catch (err) {
    return next(errorHandler(404, "User not found"));
  }
};
