import { Admin } from "../models/adminModel.js";
import jwt from 'jsonwebtoken';

const createToken = () => {
    return jwt.sign({ id: Admin._id, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
};

export const signup = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        const admin = await Admin.signup(username, email, password, confirmPassword);

        const token = createToken(admin._id);

        // Set the cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // Expires in 3 days
        });

        res.status(201).json({ admin: admin.username, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        const admin = await Admin.login(usernameOrEmail, password);
        const token = createToken(admin._id);

        // Set the token in the cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // Expires in 3 days
        });

        res.status(200).json({ admin: admin.username, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try{
        res.cookie("authToken", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);
        res.status(200).json(admin);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, confirmPassword } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No admin with that id');

        const updatedAdmin = await Admin.findByIdAndUpdate(id, { username, email, password, confirmPassword }, { new: true });
        if (!updatedAdmin) return res.status(404).send('No admin with that id');

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await Admin.findByIdAndRemove(id);
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};