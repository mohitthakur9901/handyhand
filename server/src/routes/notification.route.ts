import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller";

const router = express.Router();
