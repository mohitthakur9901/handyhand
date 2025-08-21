import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {createRating,deleteRating,getRatings,updateRating} from "../controllers/rating.controller";
 
const router = express.Router();

router.use(protectRoute);
router.post("/rating", createRating);
router.get("/rating", getRatings);
router.put("/rating/:ratingId", updateRating);
router.delete("/rating/:ratingId", deleteRating);
export default router;