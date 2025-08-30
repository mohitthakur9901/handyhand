pages:
login
signup
home
profile
settings - radius, theme
notifications  
gigs page
gigs details
gigs create

# app.use("/api/auth", UseRoute);

- router.post("/register", Register);
- router.use(protectRoute);
- router.get("/profile", getProfile);
- router.put("/profile/update", updateProfile);

# app.use("/api/gig", GigRoute);

- router.get("/gigs", getGigs);
- router.get("/gigs/:gigId", getGig);
- router.post("/gigs", createGig);
- router.put("/gigs/:gigId", updateGig);
- router.delete("/gigs/:gigId", deleteGig);

# app.use("/api/rating", RatingRoute);

- router.post("/rating", createRating);
- router.get("/rating", getRatings);
- router.put("/rating/:ratingId", updateRating);
- router.delete("/rating/:ratingId", deleteRating);

# app.use("/api/user", GigInteractionRoute);

- router.get("/gigs", getGigsBySeekerLocation);
- router.post("/gigs/:gigId/apply", applyForGig);
- router.put("/applications/:applicationId/accept", acceptApplication);

# app.use("/api/notification", NotificationRoute);

- router.get("/notifications", getMyNotifications);
- router.put("/notifications/:notificationId", markNotificationAsRead);
