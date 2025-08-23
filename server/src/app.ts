import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";

import UseRoute from "./routes/auth.route";
import GigRoute from "./routes/gig.route";
import RatingRoute from "./routes/rating.route";
import GigInteractionRoute from "./routes/gigInteraction.route";
import NotificationRoute from "./routes/notification.route";
dotenv.config({
  path: "../.env",
});
const app = express();
app.use(express.json());
app.use(cors());

app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello world" });
});
app.get("/health", (req, res) => {
  return res.status(200).json({ message: "Healthy" });
});

app.use("/api/auth", UseRoute);
app.use("/api/gig", GigRoute);
app.use("/api/rating", RatingRoute);
app.use("/api/user", GigInteractionRoute);
app.use("/api/notification", NotificationRoute);



export default app;
