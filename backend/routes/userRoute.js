import express from "express";
import {
    getUsers,
    signup,
    login,
    getUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/allusers", getUsers);
router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export const userRoutes = router;