import { getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/Asynchandler";
import prisma from "../utils/client";
import { createNotification } from "../services/notification";
import { publishNotification } from "../utils/publishNotification";
import { infoLogger, errorLogger } from "../utils/Logger";

const EARTH_RADIUS_KM = 6371;

function haversine({
  lat1,
  lon1,
  lat2,
  lon2,
}: {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

// -------------------- GET GIGS BY SEEKER LOCATION --------------------
export const getGigsBySeekerLocation = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { radius } = req.query;
    const radiusKm = Number(radius ?? 12);

    infoLogger.info("Fetching gigs by seeker location", { userId, radiusKm });

    const seekerLocation = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!seekerLocation) {
      errorLogger.error("Seeker location not found", { userId });
      throw new ApiError(404, "Seeker location not found");
    }

    const gigs = await prisma.gig.findMany({ where: { status: "OPEN" } });

    const gigsInRange = gigs.filter((gig) => {
      const distance = haversine({
        lat1: seekerLocation.latitude!,
        lon1: seekerLocation.longitude!,
        lat2: gig.latitude,
        lon2: gig.longitude,
      });
      return distance <= radiusKm;
    });

    infoLogger.info("Fetched gigs by seeker location", {
      userId,
      count: gigsInRange.length,
    });

    return res.json(
      new ApiResponse(200, gigsInRange, "Gigs fetched based on your location")
    );
  } catch (error) {
    errorLogger.error("Error fetching gigs by location", { error });
    throw new ApiError(500, "Something went wrong while fetching gigs by location");
  }
});

// -------------------- APPLY FOR A GIG --------------------
export const applyForGig = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { gigId } = req.params;

    infoLogger.info("Applying for gig", { userId, gigId });

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) {
      errorLogger.error("Gig not found", { gigId });
      throw new ApiError(404, "Gig not found");
    }
    if (gig.status !== "OPEN") throw new ApiError(400, "Gig is not open");

    const existingApplication = await prisma.gigApplication.findFirst({
      where: { gigId, seekerId: userId },
    });
    if (existingApplication) {
      errorLogger.error("Duplicate application attempt", { userId, gigId });
      throw new ApiError(400, "You have already applied for this gig");
    }

    const newApplication = await prisma.gigApplication.create({
      data: { gigId, seekerId: userId },
    });

    await createNotification({
      message: `You have a new application for ${gig.title}`,
      userId: gig.giverId,
      title: "New Application",
      type: "New Application",
    });
    publishNotification({
      message: `You have a new application for ${gig.title}`,
      userId: gig.giverId,
      title: "New Application",
      type: "New Application",
    });

    infoLogger.info("Applied to gig successfully", {
      gigId,
      seekerId: userId,
      applicationId: newApplication.id,
    });

    return res.json(
      new ApiResponse(201, newApplication, "Applied to gig successfully")
    );
  } catch (error) {
    errorLogger.error("Error applying for gig", { error, gigId: req.params.gigId });
    throw new ApiError(500, "Something went wrong while applying for gig");
  }
});

// -------------------- ACCEPT APPLICATION --------------------
export const acceptApplication = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { applicationId } = req.params;

    infoLogger.info("Accepting application", { userId, applicationId });

    const application = await prisma.gigApplication.findUnique({
      where: { id: applicationId },
      include: { gig: true },
    });

    if (!application) {
      errorLogger.error("Application not found", { applicationId });
      throw new ApiError(404, "Application not found");
    }
    if (application.gig.giverId !== userId) {
      errorLogger.error("Unauthorized accept attempt", {
        userId,
        gigId: application.gigId,
      });
      throw new ApiError(403, "Not authorized to accept this application");
    }

    const updatedApp = await prisma.gigApplication.update({
      where: { id: applicationId },
      data: { status: "ACCEPTED" },
    });

    // Reject others
    const rejectedApps = await prisma.gigApplication.findMany({
      where: { gigId: application.gigId, id: { not: applicationId } },
    });
    if (rejectedApps.length > 0) {
      await prisma.gigApplication.updateMany({
        where: { gigId: application.gigId, id: { not: applicationId } },
        data: { status: "REJECTED" },
      });

      for (const rejected of rejectedApps) {
        publishNotification({
          message: "Your application has been rejected by the gig giver.",
          userId: rejected.seekerId,
          title: "Application Rejected",
          type: "APP_REJECTED",
        });

        await createNotification({
          userId: rejected.seekerId,
          title: "Application Rejected",
          message: "Your application has been rejected by the gig giver.",
          type: "APP_REJECTED",
        });
      }
    }

    // Update gig
    await prisma.gig.update({
      where: { id: application.gigId },
      data: { seekerId: application.seekerId, status: "ASSIGNED" },
    });

    publishNotification({
      message: "Your application has been accepted by the gig giver.",
      userId: application.seekerId,
      title: "Application Accepted",
      type: "APP_ACCEPTED",
    });
    await createNotification({
      userId: application.seekerId,
      title: "Application Accepted",
      message: "Your application has been accepted by the gig giver.",
      type: "APP_ACCEPTED",
    });

    infoLogger.info("Application accepted successfully", {
      applicationId,
      gigId: application.gigId,
      seekerId: application.seekerId,
    });

    return res.json(new ApiResponse(200, updatedApp, "Application accepted"));
  } catch (error) {
    errorLogger.error("Error accepting application", {
      error,
      applicationId: req.params.applicationId,
    });
    throw new ApiError(500, "Something went wrong while accepting application");
  }
});
