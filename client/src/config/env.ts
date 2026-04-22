const requiredVars = ["VITE_API_BASE_URL"] as const;

for (const key of requiredVars) {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
};
