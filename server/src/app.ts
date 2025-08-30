import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";

import UseRoute from "./routes/auth.route";
import GigRoute from "./routes/gig.route";
import RatingRoute from "./routes/rating.route";
import GigInteractionRoute from "./routes/gigInteraction.route";
import NotificationRoute from "./routes/notification.route";

import { requestCounter, requestDuration, getMetrics } from "./metrics/metrics";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  })
);


app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000; 
    requestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      code: res.statusCode,
    });

    requestDuration.observe(
      { method: req.method, route: req.route?.path || req.path, code: res.statusCode },
      duration
    );
  });

  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the server!" });
});

app.get("/health", (req, res) => res.status(200).json({ message: "Healthy" }));


app.get("/metrics", async (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(await getMetrics());
});

// API Routes
app.use("/api/auth", UseRoute);
app.use("/api/gig", GigRoute);
app.use("/api/rating", RatingRoute);
app.use("/api/user", GigInteractionRoute);
app.use("/api/notification", NotificationRoute);

export default app;

