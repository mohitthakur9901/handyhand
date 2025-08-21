import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  updateGig,
} from "../controllers/gig.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();



router.use(protectRoute);
router.get("/gigs", getGigs);
router.get("/gigs/:gigId", getGig);
router.post("/gigs", createGig);
router.put("/gigs/:gigId", updateGig);
router.delete("/gigs/:gigId", deleteGig);


export default router;