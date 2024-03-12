import { Follow } from "../models/followModel.js"
import { User } from "../models/userModel.js"

export const getFollowAndFollowing = async (req, res) => {
    const userId = req.user._id;
    try {
        const userFollows = await Follow.find({ followerId: userId });
        const userFollowers = await Follow.find({ followingId: userId });

        res.status(200).json({ following: userFollows, followers: userFollowers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllFollowersAndFollowings = async (req, res) => {
    const userId = req.user._id;
    try {
        const userFollowing = await Follow.find({ followerId: userId });
        const userFollowers = await Follow.find({ followingId: userId });

        res.status(200).json({ following: userFollowing, followers: userFollowers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const follow = async (req, res) => {
    const { id: followingId } = req.params;
    const followerId = req.user._id;
    try {
        const existingFollow = await Follow.findOne({ followerId, followingId });
        if (existingFollow) {
            return res.status(400).json({ message: 'User is already being followed' });
        }

        const followerExist = await User.findById(followerId);
        const followingExist = await User.findById(followingId);
        if (!followerExist || !followingExist) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const follow = await Follow.create({ followerId, followingId });

        followerExist?.following?.push(followingId);
        await followerExist.save();
        
        followingExist?.followers?.push(followerId);
        await followingExist.save();

        res.status(201).json(follow);
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
};

export const unFollow = async (req, res) => {
    const { id: followingId } = req.params;
    const followerId = req.user._id;
    try {
        const unFollow = await Follow.findOneAndDelete({ followerId, followingId });
        if (!unFollow) {
            return res.status(404).json({ message: 'No follow found to delete' });
        }

        const followerExist = await User.findById(followerId);
        const followingExist = await User.findById(followingId);

        if (followerExist) {
            followerExist.following = followerExist.following.filter(id => id.toString() !== followingId);
            await followerExist.save();
        }

        if (followingExist) {
            followingExist.followers = followingExist.followers.filter(id => id.toString() !== followerId);
            await followingExist.save();
        }

        res.status(200).json({ message: 'Unfollowed successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
};