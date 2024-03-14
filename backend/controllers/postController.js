import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

// Create a post
export const createPost = async (req, res) => {
    const { postContent } = req.body;
    const userId = req.user._id;
    try {
        const UserExists = await User.findById(userId);
        if (!UserExists) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const newPost = await Post.create({ userId, postContent });
        
        // Add the post to the user's posts array
        UserExists.posts.push(newPost._id);
        await UserExists.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Get all posts
export const getPosts = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.user && req.user._id;
    try {
        let posts = [];

        // If userId is not provided, get all posts from the users the current user is following
        if (!userId) {
            const user = await User.findById(currentUser);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const usersToQuery = [currentUser, ...user.following];
            posts = await Post.find({ userId: { $in: usersToQuery } }).sort({ createdAt: -1 });
        }
        // If userId is provided, get all posts from the user with the provided userId 
        else {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isFollowing = user.followers.includes(currentUser);
            if (!isFollowing) return res.status(403).json({ message: 'You are not following this user' });

            posts = await Post.find({ userId }).sort({ createdAt: -1 });
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get a post
export const getPost = async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user._id;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

        // Check if the post exists
        const post = await Post.findById(id);
        if (!post) return res.status(404).send('No post with that id');

        // Check if the user is following the user who created the post
        const user = await User.findById(post.userId);
        if (!user) return res.status(404).send('User not found');

        const isFollowing = user.followers.includes(currentUser);
        if (!isFollowing) return res.status(403).json({ message: 'You are not following this user' });

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { postContent } = req.body;
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

        const updatedPost = await Post.findByIdAndUpdate(id, { postContent, updatedAt: new Date() }, { new: true });
        if (!updatedPost) return res.status(404).send('No post with that id');

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    const { id } = req.params;
    const UserId = req.user._id;
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) return res.status(404).send('No post with that id');
        
        // Remove the post from the user's posts array
        const user = await User.findById(UserId);
        if (!user) return res.status(404).send('No user with that id');

        // Remove the post from the user's posts array using filter
        user.posts = user.posts.filter((postId) => postId !== id);
        await user.save();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};