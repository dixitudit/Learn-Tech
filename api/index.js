import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/user.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB is connected");
});

const app = express();

app.use('/api/user',userRoutes);


app.listen(3000, () => {
  console.log("server is running on port number 3000");
});
