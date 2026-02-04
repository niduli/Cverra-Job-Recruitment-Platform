import express from "express";
import cors from "cors";

// Firebase initialization (side-effect import)
import "./config/firebaseAdmin.js";

// Routes
import routes from "./routes/index.js";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";




// Middlewares
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.use("/api/health", healthRoutes);

// Base routes
app.use("/api", routes);

// Auth routes
app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/protected", protectedRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);




// Error handler (must be last)
app.use(errorMiddleware);

export default app;
