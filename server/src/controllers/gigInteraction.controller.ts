import { getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/Asynchandler";
import prisma from "../utils/client";
import { createNotification } from "../services/notification";
import { publishNotification } from "../utils/publishNotification";

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

// get gigs based on seeker location range
export const getGigsBySeekerLocation = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { radius } = req.query;
    const radiusKm = Number(radius ?? 12);
  
    const seekerLocation = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!seekerLocation) {
      throw new ApiError(404, "Seeker location not found");
    }

    //  fetch gigs based on seeker's live
    const gigs = await prisma.gig.findMany({
      where: {
        status: "OPEN",
      },
    });
    
    const gigsInRange = gigs.filter((gig) => {
      const distance = haversine({
        lat1: seekerLocation.latitude!,
        lon1: seekerLocation.longitude!,
        lat2: gig.latitude,
        lon2: gig.longitude,
      });
      return distance <= radiusKm;
    });

    return res.json(
      new ApiResponse(200, gigsInRange, "Gigs fetched based on your location")
    );
  } catch (error) {
    console.error("getGigsByLocation error:", error);
    throw new ApiError(
      500,
      "Something went wrong while fetching gigs by location"
    );
  }
});

// Seeker can apply for a gig
export const applyForGig = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { gigId } = req.params;
    const gig = await prisma.gig.findUnique({
      where: {
        id: gigId,
      },
    });
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }
    if (gig.status !== "OPEN") throw new ApiError(400, "Gig is not open");

    const existingApplication = await prisma.gigApplication.findFirst({
      where: {
        gigId: gigId,
        seekerId: userId,
      },
    });
    if (existingApplication) {
      throw new ApiError(400, "You have already applied for this gig");
    }
    const newApplication = await prisma.gigApplication.create({
      data: {
        gigId: gigId,
        seekerId: userId,
      },
    });

    // TODO: send notification to gig owner

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

    return res.json(
      new ApiResponse(201, newApplication, "Applied to gig successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while applying for gig");
  }
});

// giver can accept or reject an application
export const acceptApplication = AsyncHandler(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { applicationId } = req.params;

    const application = await prisma.gigApplication.findUnique({
      where: { id: applicationId },
      include: { gig: true },
    });

    if (!application) throw new ApiError(404, "Application not found");
    if (application.gig.giverId !== userId)
      throw new ApiError(403, "Not authorized to accept this application");

    // Mark this application as accepted
    const updatedApp = await prisma.gigApplication.update({
      where: { id: applicationId },
      data: { status: "ACCEPTED" },
    });

    // Reject all others and notify them
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
      data: {
        seekerId: application.seekerId,
        status: "ASSIGNED",
      },
    });
    // TODO: send notification to seeker
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

    return res.json(new ApiResponse(200, updatedApp, "Application accepted"));
  } catch (error) {
    console.error("acceptApplication error:", error);
    throw new ApiError(500, "Something went wrong while accepting application");
  }
});
