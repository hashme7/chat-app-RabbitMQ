import  cors  from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes";
import mongoose from "mongoose";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use("/auth", authRoutes);

mongoose
  .connect("mongodb://localhost:27017/user-se")
  .then(() => {
    console.log("mogodb successfully connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log(`user service is running on 3000`);
});
