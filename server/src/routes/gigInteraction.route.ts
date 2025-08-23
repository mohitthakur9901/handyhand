import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  acceptApplication,
  applyForGig,
  getGigsBySeekerLocation,
} from "../controllers/gigInteraction.controller";

const router = express.Router();

router.use(protectRoute);
router.get("/gigs", getGigsBySeekerLocation);
router.post("/gigs/:gigId/apply", applyForGig);
router.put("/applications/:applicationId/accept", acceptApplication);



export default router;