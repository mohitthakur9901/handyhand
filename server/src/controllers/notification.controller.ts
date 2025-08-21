import { getAuth } from "@clerk/express";
import AsyncHandler from "../utils/Asynchandler";
import { getUserNotifications, markAsRead } from "../services/notification";
import ApiResponse from "../utils/ApiResponse";

// subscribe to notifications here
export const getMyNotifications = AsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const notifications = await getUserNotifications(userId);
  return res.json(new ApiResponse(200, notifications, "Notifications fetched"));
});

export const markNotificationAsRead = AsyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const updated = await markAsRead(notificationId);
  return res.json(new ApiResponse(200, updated, "Notification marked as read"));
});
