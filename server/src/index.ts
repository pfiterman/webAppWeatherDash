import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import weatherRoutes from "./routes/weather.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(express.json());

// API routes
app.use("/api", weatherRoutes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

// ===============================
// Serve frontend in production
// ===============================
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client");
  const indexPath = path.join(clientPath, "index.html");

  app.use(express.static(clientPath));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(indexPath);
  });
}

// Error handler
app.use(errorHandler);

// Dynamically port
const PORT = process.env.PORT || env.port;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
