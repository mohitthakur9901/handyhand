import { getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/Asynchandler";
import prisma from "../utils/client";

export const createGig = AsyncHandler(async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const gig = await prisma.gig.create({
            data: {
                ...req.body,
                userId: userId,
            },
        });
        return res.json(new ApiResponse(200, gig, "Gig created"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating gig");
    }
});

export const getGigs = AsyncHandler(async (req, res) => {
    try {
        const gigs = await prisma.gig.findMany();
        return res.json(new ApiResponse(200, gigs, "Gigs fetched"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching gigs");
    }
});

export const getGig = AsyncHandler(async (req, res) => {
    try {
        const { gigId } = req.params;
        const gig = await prisma.gig.findUnique({
            where: {
                id: gigId,
            },
        });
        return res.json(new ApiResponse(200, gig, "Gig fetched"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching gig");
    }
});

export const updateGig = AsyncHandler(async (req, res) => {
    try {
        const { gigId } = req.params;
        const gig = await prisma.gig.update({
            where: {
                id: gigId,
            },
            data: {
                ...req.body,
            },
        });
        return res.json(new ApiResponse(200, gig, "Gig updated"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating gig");
    }
});

export const deleteGig = AsyncHandler(async (req, res) => {
    try {
        const { gigId } = req.params;
        const gig = await prisma.gig.delete({
            where: {
                id: gigId,
            },
        });
        return res.json(new ApiResponse(200, gig, "Gig deleted"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting gig");
    }
});