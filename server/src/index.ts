import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import weatherRoutes from "./routes/weather.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
// No need for CORS in production -> same origin
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(express.json());

// API routes
app.use("/api", weatherRoutes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

// Serve frontend ONLY in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client");

  app.use(express.static(clientPath));

  // SPA fallback (React Router / Wouter)
  app.get("*", (_, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}
app.use(errorHandler);

const PORT = process.env.PORT || env.port;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
