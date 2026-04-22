import express from "express";
import cors from "cors";
import { env } from "./config/env";
import weatherRoutes from "./routes/weather.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/", weatherRoutes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

// Global error handler (must be last)
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
