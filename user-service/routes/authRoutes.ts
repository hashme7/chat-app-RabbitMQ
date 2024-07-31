import express from 'express';
import { getUsers, login, signUp } from '../controller/authController';


const authRoutes = express();

authRoutes.post('/signup',signUp);
authRoutes.post('/login',login);
authRoutes.get('/users',getUsers)

export default authRoutes;