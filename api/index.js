import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"
import path from "path"; 

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB is connected");
});

const __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, "/client/dist")));

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("server is running on port number 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client","dist","index.html"));
});

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