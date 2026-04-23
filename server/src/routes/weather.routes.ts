import { Router, Request, Response, NextFunction } from "express";
import { weatherService } from "../services/weather.service";

const router = Router();

router.get(
  "/weather/current",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "cityId parameter is required" });
        return;
      }

      const weather = await weatherService.getCurrentWeather(id);
      res.json(weather);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/weather/forecast",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "city query parameter is required" });
        return;
      }

      const forecast = await weatherService.getForecast(id);
      res.json(forecast);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
