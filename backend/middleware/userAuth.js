import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization').split(' ')[1];
        if (!token) return res.status(401).json({ errorMessage: 'Unauthorized' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id);
        if (!user) return res.status(401).json({ errorMessage: 'Unauthorized' });
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ errorMessage: 'Unauthorized' });
    }
}