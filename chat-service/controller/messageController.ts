import { Response, Request } from "express";
import { ObjectId } from "mongoose";
import Messages from "../model/messageModel";

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId } = req.params;
    const messages = await Messages.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    }).sort("timestamp");
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
  }
};

export const storeMessages = async (
  senderId: ObjectId,
  recipientId: ObjectId,
  messageContent: string
) => {
  try {
    const message = new Messages({
      senderId,
      recipientId,
      message: messageContent,
    });
    await message.save();
  } catch (error) {
    console.log(error);
  }
};
