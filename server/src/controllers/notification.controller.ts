import { getAuth } from "@clerk/express";
import AsyncHandler from "../utils/Asynchandler";
import { getUserNotifications, markAsRead } from "../services/notification";
import ApiResponse from "../utils/ApiResponse";
import { infoLogger, errorLogger } from "../utils/Logger";

// -------------------- GET MY NOTIFICATIONS --------------------
export const getMyNotifications = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    infoLogger.info("Fetching notifications", { userId });

    const notifications = await getUserNotifications(userId);

    infoLogger.info("Fetched notifications", {
      userId,
      count: notifications.length,
    });

    return res.json(
      new ApiResponse(200, notifications, "Notifications fetched")
    );
  } catch (error) {
    errorLogger.error("Error fetching notifications", { error });
    throw error; // AsyncHandler will wrap this into ApiError
  }
});

// -------------------- MARK NOTIFICATION AS READ --------------------
export const markNotificationAsRead = AsyncHandler(async (req, res) => {
  try {
    const { notificationId } = req.params;
    infoLogger.info("Marking notification as read", { notificationId });

    const updated = await markAsRead(notificationId);

    if (!updated) {
      errorLogger.error("Notification not found", { notificationId });
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Notification not found"));
    }

    infoLogger.info("Notification marked as read", { notificationId });

    return res.json(
      new ApiResponse(200, updated, "Notification marked as read")
    );
  } catch (error) {
    errorLogger.error("Error marking notification as read", {
      error,
      notificationId: req.params.notificationId,
    });
    throw error;
  }
});
