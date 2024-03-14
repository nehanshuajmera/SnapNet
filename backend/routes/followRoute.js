import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { follow, unFollow } from "../controllers/followController.js";
const router = express.Router();

router.post("/follow/:id", userAuth, follow);
router.delete("/unfollow/:id", userAuth, unFollow);

export const followRoutes = router;