import jwt from 'jsonwebtoken';

export const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization').split(' ')[1];
        if (!token) return res.status(401).json({ errorMessage: 'Unauthorized' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ errorMessage: 'Unauthorized' });
    }
}