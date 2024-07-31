import { timeStamp } from "console";
import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface MessageDocument extends Document {
  senderId: ObjectId;
  recipientId: ObjectId;
  message: string;
  timestamp: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const message = mongoose.model<MessageDocument>("Messages", messageSchema);

export default message;
