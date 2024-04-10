import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("no token");
    return next(errorHandler(401, "Access denied"));
  }
  jwt.verify(token, process.env.JWT_SE, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Access denied"));
    }
    req.user = user;
    
    next();
  });
};
