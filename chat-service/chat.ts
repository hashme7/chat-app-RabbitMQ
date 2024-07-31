import express from 'express';
import amqp from 'amqplib';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { storeMessages } from './controller/messageController';
import { ObjectId } from 'mongoose';
import { connect } from './config/database';
import messageRoute from './routes/messageRoutes';
import morgan from 'morgan';

const app = express();
app.use(morgan('tiny'));

// Connecting database
connect();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);

app.use('/chat', messageRoute);

const amqpUrl = 'amqp://localhost';
let channel: amqp.Channel | null = null;

const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
    await channel.assertQueue('notification.queue', { durable: false });
    console.log('RabbitMQ connected and channel created');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

connectRabbitMQ();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data: string) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: (${data})`);
  });

  socket.on('send_message', async (data: {
    senderId: ObjectId;
    recipientId: ObjectId;
    message: string;
  }) => {
    try {
      const { senderId, recipientId, message } = data;
      const roomId = generateRoomId(senderId, recipientId);
      socket.to(roomId).emit('receive_message', { senderId, message });
      await storeMessages(senderId, recipientId, message);

      const queue = 'notification.queue';
      const notification = { senderId, recipientId, message };

      if (channel) {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(notification)));
      } else {
        console.error('RabbitMQ channel is not initialized');
      }
      console.log(
        `Message sent from ${senderId} to ${recipientId} in room: ${roomId}`
      );
    } catch (error) {
      console.error(`Error on send message: ${error}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const generateRoomId = (userId1: ObjectId, userId2: ObjectId): string => {
  const sortedIds = [userId1, userId2].sort();
  const concatenatedIds = sortedIds.join('_');

  let hash = 0;
  for (let i = 0; i < concatenatedIds.length; i++) {
    const char = concatenatedIds.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return Math.abs(hash).toString();
};

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
