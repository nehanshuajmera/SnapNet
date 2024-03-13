import jwt from 'jsonwebtoken';
import { Admin } from '../models/adminModel.js';

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization').split(' ')[1];
        if (!token) return res.status(401).json({ errorMessage: 'Unauthorized' });

       
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ errorMessage: 'Unauthorized' });
    }
};