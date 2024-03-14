import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

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
            profileImage,
        );

        let { followers, verified } = user;

        // when user first signs up, they are not verified
        verified = false;

        if(followers.length > 20 && verified === false) {
            verified = true;
        }

        const token = createToken(user._id, "user");

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
        const token = createToken(user._id, "user");

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

export const logout = async (req, res) => {
    try {
        res.clearCookie("authToken");
        res.status(200).json({ message: "Logged out" });
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
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is the owner or an admin
        if (
            user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "You are not authorized to update this user" });
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, phoneNumber, bio, profileImage },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is the owner or an admin
        if (
            user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "You are not authorized to delete this user" });
        }

        // Delete the user
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getFollowers = async (req, res) =>{
    const userId = req.user._id;
    try{
        const user = await User.findById(userId);
        console.log(user);
    }
    catch(err){
        console.error({err: err})
        res.status(404).json({message: err.message});
    }
}