import { Follow } from "../models/followModel.js";
import { User } from "../models/userModel.js";

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

        res
            .status(200)
            .json({ following: userFollowing, followers: userFollowers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Follow a user
export const follow = async (req, res) => {
    const { id: followingId } = req.params;
    const followerId = req.user._id;
    try {
        const existingFollow = await Follow.findOne({ followerId, followingId });
        if (existingFollow) {
            return res
                .status(400)
                .json({ message: "User is already being followed" });
        }

        // Check if the user exists
        const [followerExist, followingExist] = await Promise.all([
            User.findById(followerId),
            User.findById(followingId),
        ]);
        if (!followerExist || !followingExist) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Check if the user is trying to follow themselves
        if (followerId.toString() === followingId.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        // Update the followers and following count
        followerExist.following.push(followingId);
        followerExist.followingCount = followerExist.following.length;

        // Check if the user is verified and has more than 20 followers
        if (followingExist.followersCount >= 10) {
            followingExist.verified = true;
        }
        
        console.log(followingExist.verified);
        console.log(followingExist.followersCount);
        console.log(followingExist);
        await followerExist.save();

        // Update the followers count for the user being followed
        followingExist.followers.push(followerId);
        followingExist.followersCount = followingExist.followers.length;

        await followingExist.save();

        const follow = await Follow.create({ followerId, followingId });
        res.status(201).json(follow);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Unfollow a user
export const unFollow = async (req, res) => {
    const { id: followingId } = req.params;
    const followerId = req.user._id;
    try {
        const unFollow = await Follow.findOneAndDelete({ followerId, followingId });
        if (!unFollow) {
            return res.status(404).json({ message: "No follow found to delete" });
        }

        const [followerExist, followingExist] = await Promise.all([
            User.findById(followerId),
            User.findById(followingId),
        ]);

        if (followerExist) {
            followerExist.following = followerExist.following.filter(
                (id) => id.toString() !== followingId
            );
            followerExist.followingCount = followerExist.following.length;

            await followerExist.save();
        }

        if (followingExist) {
            followingExist.followers = followingExist.followers.filter(
                (id) => id.toString() !== followerId
            );
            followingExist.followersCount = followingExist.followers.length;

            // Check if the user being unfollowed is verified and has less than 20 followers
            if (followingExist.followersCount < 20 && followingExist.verified) {
                followingExist.verified = false;
                await followingExist.updateVerifiedStatus();
            }

            await followingExist.save();
        }

        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};