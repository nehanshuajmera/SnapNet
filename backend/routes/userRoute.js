import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { userAuth } from "../middleware/userAuth.js";
import {
    getUsers,
    signup,
    login,
    logout,
    getUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/allusers", adminAuth, getUsers);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", userAuth, logout);
router.get("/:id", userAuth, getUser);
router.patch("/:id", userAuth, updateUser);
router.delete("/:id", userAuth, deleteUser);

export const userRoutes = router;