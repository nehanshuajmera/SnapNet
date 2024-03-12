import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import {
    getFollowAndFollowing,
    getAllFollowersAndFollowings,
    follow,
    unFollow,
} from "../controllers/followController.js";
const router = express.Router();

router.get("/follower/:id", userAuth, getFollowAndFollowing);
router.get("/following/:id", userAuth, getFollowAndFollowing);
router.get("/followers", userAuth, getAllFollowersAndFollowings);
router.get("/followings", userAuth, getAllFollowersAndFollowings);
router.post("/follow/:id", userAuth, follow);
router.delete("/unfollow/:id", userAuth, unFollow);

export const followRoutes = router;