import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";


import UseRoute from "./routes/auth.route";
import GigRoute from "./routes/gig.route";
import RatingRoute from "./routes/rating.route";
import GigInteractionRoute from "./routes/gigInteraction.route";

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
  res.send("Hello World!");
});
app.get("/health", (req, res) => {
  res.send("Healthy");
});

app.use("/api/user", UseRoute);
app.use("/api/gig", GigRoute);
app.use("/api/rating", RatingRoute);
app.use("/api/gigInteraction", GigInteractionRoute);

export default app;