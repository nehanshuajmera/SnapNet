import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
    login,
    signup,
    logout,
    getAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
} from "../controllers/adminController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", adminAuth, logout);
router.get("/:id", adminAuth, getAdmin);
router.get("/alladmins", adminAuth, getAdmins);
router.patch("/:id", adminAuth, updateAdmin);
router.delete("/:id", adminAuth, deleteAdmin);

export const adminRoutes = router;