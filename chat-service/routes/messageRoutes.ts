import { getMessage } from './../controller/messageController';
import express from 'express';


const messageRoute = express();

messageRoute.get('/messages/:senderId/:recipientId',getMessage);


export default messageRoute;