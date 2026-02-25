// import express from "express";
// import cors from "cors";

// // Firebase initialization (side-effect import)
// import "./config/firebaseAdmin.js";

// // Routes
// import routes from "./routes/index.js";
// import authRoutes from "./routes/authRoutes.js";
// import healthRoutes from "./routes/healthRoutes.js";
// import testRoutes from "./routes/testRoutes.js";
// import protectedRoutes from "./routes/protectedRoutes.js";
// import jobRoutes from "./routes/jobRoutes.js";
// import applicationRoutes from "./routes/applicationRoutes.js";
// import cvRoutes from "./routes/cvRoutes.js";





// // Middlewares
// import errorMiddleware from "./middlewares/errorMiddleware.js";

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Health check
// app.use("/api/health", healthRoutes);

// // Base routes
// app.use("/api", routes);

// // Auth routes
// app.use("/api/auth", authRoutes);

// app.use("/api/test", testRoutes);

// app.use("/api/protected", protectedRoutes);

// app.use("/api/jobs", jobRoutes);

// app.use("/api/applications", applicationRoutes);

// app.use("/api/cv", cvRoutes);





// // Error handler (must be last)
// app.use(errorMiddleware);

// export default app;


import express from "express";
import cors from "cors";

// Firebase initialization
import "./config/firebaseAdmin.js";

// Routes
import routes from "./routes/index.js";

// Middleware
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Disable caching for API responses during development
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// All API routes go through index.js
app.use("/api", routes);

// Error handler (must be last)
app.use(errorMiddleware);

export default app;
