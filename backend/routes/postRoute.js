import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
} from "../controllers/postController.js";
const router = express.Router();

router.post("/create", userAuth, createPost);
router.get("/", userAuth, getPosts);
router.get("/:id", userAuth, getPost);
router.patch("/:id", userAuth, updatePost);
router.delete("/:id", userAuth, deletePost);

export const postRoutes = router;