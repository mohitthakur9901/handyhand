import express from "express";
import {
  Register,
  getProfile,
  updateProfile,
} from "../controllers/auth.conroller";
import { protectRoute } from "../middleware/auth.middleware";


const router = express.Router();

router.post("/register", Register);
router.use(protectRoute);
router.get("/profile", getProfile);
router.put("/profile/update", updateProfile);

export default router;
