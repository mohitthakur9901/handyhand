import prisma from "../utils/client";

export const createNotification = async ({ userId, title, message, type }) => {
  return await prisma.notification.create({
    data: { userId, title, message, type },
  });
};

export const markAsRead = async (notificationId) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};

export const getUserNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
