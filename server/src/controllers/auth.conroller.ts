import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/Asynchandler";
import prisma from "../utils/client";

import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";

export const Register = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) {
      // remove password from response
      const { password, ...safeUser } = existingUser;
      return res.json(
        new ApiResponse(200, safeUser, "User already registered")
      );
    }
    const clerkUser = await clerkClient.users.getUser(userId);
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.firstName + " " + clerkUser.lastName,
        profileImage: clerkUser.imageUrl,
        ...req.body,
      },
    });
    return res.json(new ApiResponse(200, newUser, "User registered"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while registering user");
  }
});

export const updateProfile = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        ...req.body,
      },
    });
    return res.json(new ApiResponse(200, updatedUser, "User updated"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while updating user");
  }
});

export const getProfile = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }
    return res.json(new ApiResponse(200, existingUser, "User found"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while getting user");
  }
});