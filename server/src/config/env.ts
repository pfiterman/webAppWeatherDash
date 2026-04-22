import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "OPENWEATHERMAP_API_KEY",
  "OPENWEATHERMAP_BASE_URL",
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: process.env.PORT || "3000",
  openWeatherMap: {
    apiKey: process.env.OPENWEATHERMAP_API_KEY as string,
    baseUrl: process.env.OPENWEATHERMAP_BASE_URL as string,
  },
};
