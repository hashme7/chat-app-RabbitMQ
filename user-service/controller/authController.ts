import { Request, Response } from "express";
import User from "../model/userModel";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      console.log(password,"paswo")
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: "user signed up successfully" ,success:true});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internel server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("SECRET_KEY environment variable is not set");
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log(isValid,"kfjaskdfj")
      if (isValid) {
        console.log("password correct")
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          secretKey,
          { expiresIn: "1h" }
        );
        res.status(200).json({ message: "auth completed successfully" ,user,token});
      } else {
        console.log("password wrong")
        res.status(401).json({ Error: "User is not athenticated" });
      }
    } else {
      console.log("no user")
      res.status(401).json({ Error: "User is not there" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internel server error" });
  }
};

export const getUsers = async (req:Request,res:Response) =>{
  try {
    const userList = await User.find({});
    res.status(200).json({userList})
  } catch (error) {
    console.log(error);
  }
};
