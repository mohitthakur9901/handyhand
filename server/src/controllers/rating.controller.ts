import { getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/Asynchandler";
import prisma from "../utils/client";
import { infoLogger, errorLogger } from "../utils/Logger";

// -------------------- CREATE RATING --------------------
export const createRating = AsyncHandler(async (req, res) => {
  try {
    const { rating, comment, receiverId } = req.body;
    const { userId } = getAuth(req);

    if (!rating || rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }

    if (userId === receiverId) {
      throw new ApiError(400, "You cannot rate yourself");
    }

    const ratingData = await prisma.rating.create({
      data: {
        rating,
        comment,
        giverId: userId,
        receiverId,
      },
    });

    infoLogger.info("Rating created", { userId, receiverId, rating });

    return res.json(new ApiResponse(201, ratingData, "Rating created"));
  } catch (error) {
    errorLogger.error("Error creating rating", { error });
    throw new ApiError(500, "Something went wrong while creating rating");
  }
});

// -------------------- GET RATINGS --------------------
export const getRatings = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const ratings = await prisma.rating.findMany({
      where: { receiverId: userId },
      include: {
        giver: { select: { id: true, username: true, profileImage: true } }, 
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(new ApiResponse(200, ratings, "Ratings fetched"));
  } catch (error) {
    errorLogger.error("Error fetching ratings", { error });
    throw new ApiError(500, "Something went wrong while fetching ratings");
  }
});

// -------------------- DELETE RATING --------------------
export const deleteRating = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { ratingId } = req.params;

    const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
    if (!rating) throw new ApiError(404, "Rating not found");

    if (rating.giverId !== userId) {
      throw new ApiError(403, "Not authorized to delete this rating");
    }

    const deleted = await prisma.rating.delete({ where: { id: ratingId } });

    return res.json(new ApiResponse(200, deleted, "Rating deleted"));
  } catch (error) {
    errorLogger.error("Error deleting rating", { error });
    throw new ApiError(500, "Something went wrong while deleting rating");
  }
});

// -------------------- UPDATE RATING --------------------
export const updateRating = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { ratingId } = req.params;

    const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
    if (!rating) throw new ApiError(404, "Rating not found");

    if (rating.giverId !== userId) {
      throw new ApiError(403, "Not authorized to update this rating");
    }

    const updated = await prisma.rating.update({
      where: { id: ratingId },
      data: req.body,
    });

    return res.json(new ApiResponse(200, updated, "Rating updated"));
  } catch (error) {
    errorLogger.error("Error updating rating", { error });
    throw new ApiError(500, "Something went wrong while updating rating");
  }
});
