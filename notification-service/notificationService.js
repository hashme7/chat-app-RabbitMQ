import { WebSocketServer } from 'ws';
import amqp from 'amqplib';

const wss = new WebSocketServer({ port: 8081 });
const clients = new Map();

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'notification.queue';

    await channel.assertQueue(queue, { durable: false });
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
    channel.consume(
      queue,
      (msg) => {
        const { senderId, recipientId, message } = JSON.parse(msg.content.toString());
        console.log(`Received notification for ${senderId} ${recipientId}: ${message}`);
        const ws = clients.get(recipientId);
        if (ws) {
          ws.send(JSON.stringify({ senderId, message }));
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log(clients)
      if (parsedMessage.type === 'init') {
        clients.set(parsedMessage.userId, ws);
        console.log(`User connected: ${parsedMessage.userId}`);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    // Handle client disconnection
    clients.forEach((clientWs, userId) => {
      if (clientWs === ws) {
        clients.delete(userId);
      }
    });
  });
});

try {
  connectRabbitMQ();
} catch (error) {
  console.log(error.message, error);
}
