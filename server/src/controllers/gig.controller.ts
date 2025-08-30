import { getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/Asynchandler";
import prisma from "../utils/client";
import { infoLogger, errorLogger } from "../utils/Logger";

// -------------------- CREATE GIG --------------------
export const createGig = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    infoLogger.info("Creating gig", { userId, body: req.body });

    const gig = await prisma.gig.create({
      data: {
        ...req.body,
        userId,
      },
    });

    infoLogger.info("Gig created successfully", { gigId: gig.id, userId });
    return res.json(new ApiResponse(200, gig, "Gig created"));
  } catch (error) {
    errorLogger.error("Error creating gig", { error, body: req.body });
    throw new ApiError(500, "Something went wrong while creating gig");
  }
});

// -------------------- GET ALL GIGS --------------------
export const getGigs = AsyncHandler(async (req, res) => {
  try {
    infoLogger.info("Fetching all gigs");

    const gigs = await prisma.gig.findMany();

    infoLogger.info("Fetched gigs successfully", { count: gigs.length });
    return res.json(new ApiResponse(200, gigs, "Gigs fetched"));
  } catch (error) {
    errorLogger.error("Error fetching gigs", { error });
    throw new ApiError(500, "Something went wrong while fetching gigs");
  }
});

// -------------------- GET SINGLE GIG --------------------
export const getGig = AsyncHandler(async (req, res) => {
  try {
    const { gigId } = req.params;
    infoLogger.info("Fetching gig", { gigId });

    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
    });

    if (!gig) {
      errorLogger.error("Gig not found", { gigId });
      throw new ApiError(404, "Gig not found");
    }

    infoLogger.info("Gig fetched successfully", { gigId });
    return res.json(new ApiResponse(200, gig, "Gig fetched"));
  } catch (error) {
    errorLogger.error("Error fetching gig", { error, gigId: req.params.gigId });
    throw new ApiError(500, "Something went wrong while fetching gig");
  }
});

// -------------------- UPDATE GIG --------------------
export const updateGig = AsyncHandler(async (req, res) => {
  try {
    const { gigId } = req.params;
    infoLogger.info("Updating gig", { gigId, body: req.body });

    const gig = await prisma.gig.update({
      where: { id: gigId },
      data: { ...req.body },
    });

    infoLogger.info("Gig updated successfully", { gigId });
    return res.json(new ApiResponse(200, gig, "Gig updated"));
  } catch (error) {
    errorLogger.error("Error updating gig", { error, gigId: req.params.gigId });
    throw new ApiError(500, "Something went wrong while updating gig");
  }
});

// -------------------- DELETE GIG --------------------
export const deleteGig = AsyncHandler(async (req, res) => {
  try {
    const { gigId } = req.params;
    infoLogger.info("Deleting gig", { gigId });

    const gig = await prisma.gig.delete({
      where: { id: gigId },
    });

    infoLogger.info("Gig deleted successfully", { gigId });
    return res.json(new ApiResponse(200, gig, "Gig deleted"));
  } catch (error) {
    errorLogger.error("Error deleting gig", { error, gigId: req.params.gigId });
    throw new ApiError(500, "Something went wrong while deleting gig");
  }
});
