import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
};

export const signup = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            confirmPassword,
            phoneNumber,
            bio,
            profileImage,
        } = req.body;
        const user = await User.signup(
            username,
            email,
            password,
            confirmPassword,
            phoneNumber,
            bio,
            profileImage
        );

        const token = createToken(user._id);

        // Set the cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // Expires in 3 days
        });

        res.status(201).json({ user: user.username, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        const user = await User.login(usernameOrEmail, password);
        const token = createToken(user._id);

        // Set the token in the cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // Expires in 3 days
        });

        res.status(200).json({ user: user.username, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const { username, email, phoneNumber, bio, profileImage } = req.body;
        const user = await User.findByIdAndUpdate(
            id,
            { username, email, phoneNumber, bio, profileImage },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};