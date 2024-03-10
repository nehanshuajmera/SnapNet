import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
const router = express.Router();

router.get('/users', getUsers);
router.post('/signup', signup);
router.post('/login', login);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);