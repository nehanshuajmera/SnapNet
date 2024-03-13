import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";

export const adminAuth = async (req, res, next) => {
    try {
        const token =
            req.cookies.token || req.header("Authorization").split(" ")[1];
        if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(verified.id);

        console.log(admin)
        console.log(verified)
        console.log(verified.id)

        if (!admin) return res.status(401).json({ errorMessage: "Not authorized to access this resource" });
        
        req.admin = admin;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).send({ error: 'Please authenticate' });
    }
};