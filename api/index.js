import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB is connected");
});

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("server is running on port number 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


/* below is the middleware to handle all the errors it needs to be 
at last as this chain of app.use is like a linked list these all 
are the middlewares some are custom like below some are already 
there like express.json() where next is the next middleware in the
 chain.


This middleware is set at last because then it can handle any 
error that may occour in the above middlewares and routes. */


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, statusCode, message });
});