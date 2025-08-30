import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/Asynchandler";
import prisma from "../utils/client";
import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";
import { infoLogger, errorLogger } from "../utils/Logger"; 

// -------------------- REGISTER --------------------
export const Register = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    infoLogger.info("Register request started", { userId });

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      infoLogger.info("User already exists", { userId, email: existingUser.email });

      const { password, updatedAt, createdAt, ...safeUser } = existingUser;
      return res.json(new ApiResponse(200, safeUser, "User already registered"));
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    infoLogger.info("Fetched Clerk user", { userId, email: clerkUser.emailAddresses[0].emailAddress });

    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: `${clerkUser.firstName} ${clerkUser.lastName}`,
        profileImage: clerkUser.imageUrl,
        ...req.body,
      },
    });

    infoLogger.info("New user registered", { userId, email: newUser.email });
    return res.json(new ApiResponse(200, newUser, "User registered"));
  } catch (error) {
    errorLogger.error("Error in Register", { error, body: req.body });
    throw new ApiError(500, "Something went wrong while registering user");
  }
});

// -------------------- UPDATE PROFILE --------------------
export const updateProfile = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    infoLogger.info("Update profile request", { userId });

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      errorLogger.error("User not found for update", { userId });
      throw new ApiError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { ...req.body },
    });

    infoLogger.info("User profile updated", { userId, updatedFields: Object.keys(req.body) });
    return res.json(new ApiResponse(200, updatedUser, "User updated"));
  } catch (error) {
    errorLogger.error("Error in updateProfile", { error, userId: getAuth(req).userId });
    throw new ApiError(500, "Something went wrong while updating user");
  }
});

// -------------------- GET PROFILE --------------------
export const getProfile = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    infoLogger.info("Get profile request", { userId });

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      errorLogger.error("User not found in getProfile", { userId });
      throw new ApiError(404, "User not found");
    }

    infoLogger.info("Profile retrieved", { userId, email: existingUser.email });
    return res.json(new ApiResponse(200, existingUser, "User found"));
  } catch (error) {
    errorLogger.error("Error in getProfile", { error, userId: getAuth(req).userId });
    throw new ApiError(500, "Something went wrong while getting user");
  }
});
