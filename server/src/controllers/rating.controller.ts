import { getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/Asynchandler";
import prisma from "../utils/client";

// both giver and seeker can rate each other
export const createRating = AsyncHandler(async (req, res) => {
  try {
    const { rating, comment, receiverId } = req.body;
    // giver id
    const { userId } = getAuth(req);
    const ratingData = await prisma.rating.create({
      data: {
        rating: rating,
        comment: comment,
        giverId: userId,
        receiverId: receiverId,
      },
    });

    return res.json(new ApiResponse(200, ratingData, "Rating created"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating rating");
  }
});
export const getRatings = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const ratings = await prisma.rating.findMany({
      where: {
        receiverId: userId,
      },
    });
    return res.json(new ApiResponse(200, ratings, "Ratings fetched"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching ratings");
  }
});

export const deleteRating = AsyncHandler(async (req, res) => {
  try {
    const { ratingId } = req.params;
    const rating = await prisma.rating.delete({
      where: {
        id: ratingId,
      },
    });
    return res.json(new ApiResponse(200, rating, "Rating deleted"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deleting rating");
  }
});

export const updateRating = AsyncHandler(async (req, res) => {
  try {
    const { ratingId } = req.params;
    const rating = await prisma.rating.update({
      where: {
        id: ratingId,
      },
      data: {
        ...req.body,
      },
    });
    return res.json(new ApiResponse(200, rating, "Rating updated"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while updating rating");
  }
});