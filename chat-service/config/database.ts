import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connect = (): void => {
  try {
    const connectionString = process.env.CONNECT_STRING as string;

    if (!connectionString) {
      throw new Error("CONNECTION_STRING is not defined in the environment variables.");
    }

    mongoose.connect(connectionString)
      .then(() => {
        console.log("MongoDB successfully connected");
      })
      .catch((error) => {
        console.log(`Error connecting to MongoDB: ${error}`);
      });
  } catch (error) {
    console.log(`Error on connecting the database: ${error}`);
  }
};
