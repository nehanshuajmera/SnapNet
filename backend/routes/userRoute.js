import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import {
    getUsers,
    signup,
    login,
    getUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/allusers", userAuth, getUsers);
router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", userAuth, getUser);
router.patch("/:id", userAuth, updateUser);
router.delete("/:id", userAuth, deleteUser);

export const userRoutes = router;