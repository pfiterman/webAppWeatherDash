# WeatherDash

A full-stack weather dashboard application built with **React + Vite** (frontend) and **Node.js + Express + TypeScript** (backend), powered by the OpenWeatherMap API.

---

## Features

- Real-time current weather conditions
- 5-day hourly forecast breakdown
- Multi-city support with persistent last-visited city
- Temperature unit toggle (Celsius / Fahrenheit)
- Loading skeletons for smooth UX
- Error boundaries and retry handling
- Fully responsive design

---

## Project Structure

```
weather-app/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── api/              # Raw HTTP fetch layer
│   │   ├── components/       # UI components
│   │   │   ├── ui/           # Reusable primitives (ErrorBoundary, Skeletons)
│   │   │   └── weather/      # Domain components (WeatherCard, ForecastTable)
│   │   ├── hooks/            # Custom React hooks (useWeatherDashboard)
│   │   ├── lib/              # Utilities (formatters, storage, API helpers)
│   │   ├── pages/            # Page-level components
│   │   ├── types/            # Shared TypeScript interfaces
│   │   └── config/           # Environment variable validation
│   ├── .env.development      # Frontend env vars (gitignored)
│   ├── .env.example          # Env template
│   └── vite.config.ts
│
├── server/                   # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/           # Env validation (fail-fast)
│   │   ├── routes/           # Express route handlers
│   │   ├── services/         # Business logic & OpenWeatherMap calls
│   │   └── middleware/       # Global error handler
│   ├── .env                  # Server env vars (gitignored)
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

| Tool                   | Version                                        |
| ---------------------- | ---------------------------------------------- |
| Node.js                | v20.6+                                         |
| npm                    | v9+                                            |
| OpenWeatherMap API Key | [Get one free](https://openweathermap.org/api) |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pfiterman/webAppWeatherDash.git
cd webAppWeatherDash
```

### 2. Set up the Server

```bash
cd server
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=3000
OPENWEATHERMAP_API_KEY=your_api_key_here
OPENWEATHERMAP_BASE_URL=https://api.openweathermap.org/data/2.5
```

### 3. Set up the Client

```bash
cd ../client
npm install
```

Create your environment file:

```bash
cp .env.example .env.development
```

Fill in your `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Running the App

### Run the server

```bash
cd server
npm run dev
```

Server starts at: `http://localhost:3000`

### Run the client (in a separate terminal)

```bash
cd client
npm run dev
```

Client starts at: `http://localhost:5173`

### Run both simultaneously (from project root)

```bash
npm install        # installs concurrently at root
npm run dev        # starts both server and client
```

---

## Building for Production

### Build the server

```bash
cd server
npm run build      # compiles TypeScript → dist/
npm run start      # runs compiled output
```

### Build the client

```bash
cd client
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## API Endpoints

| Method | Endpoint                            | Description                |
| ------ | ----------------------------------- | -------------------------- |
| `GET`  | `/health`                           | Server health check        |
| `GET`  | `/api/weather/current?id={cityId}`  | Current weather by city ID |
| `GET`  | `/api/weather/forecast?id={cityId}` | 5-day forecast by city ID  |

### Example Requests

```bash
# Health check
curl http://localhost:3000/health

# Current weather for Toronto (ID: 6167865)
curl http://localhost:3000/api/weather?id=6167865

# 5-day forecast for Tokyo (ID: 1850147)
curl http://localhost:3000/api/weather/forecast?id=1850147
```

---

## Tech Stack

### Frontend (`/client`)

| Library                                                     | Version | Purpose                            |
| ----------------------------------------------------------- | ------- | ---------------------------------- |
| [React](https://react.dev)                                  | ^19     | UI framework                       |
| [Vite](https://vitejs.dev)                                  | ^6      | Build tool & dev server            |
| [TypeScript](https://www.typescriptlang.org)                | ^5      | Type safety                        |
| [Tailwind CSS](https://tailwindcss.com)                     | ^4      | Utility-first styling              |
| [shadcn/ui](https://ui.shadcn.com)                          | latest  | Accessible UI primitives           |
| [Radix UI](https://www.radix-ui.com)                        | latest  | Headless component primitives      |
| [Lucide React](https://lucide.dev)                          | latest  | Icon library                       |
| [class-variance-authority](https://cva.style)               | latest  | Component variant styling          |
| [clsx](https://github.com/lukeed/clsx)                      | latest  | Conditional class merging          |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | latest  | Tailwind class conflict resolution |

### Backend (`/server`)

| Library                                      | Version | Purpose                       |
| -------------------------------------------- | ------- | ----------------------------- |
| [Node.js](https://nodejs.org)                | v20.6+  | Runtime                       |
| [Express](https://expressjs.com)             | ^4      | HTTP server framework         |
| [TypeScript](https://www.typescriptlang.org) | ^5      | Type safety                   |
| [dotenv](https://github.com/motdotla/dotenv) | ^16     | Environment variable loading  |
| [cors](https://github.com/expressjs/cors)    | ^2      | Cross-origin resource sharing |
| [ts-node](https://typestrong.org/ts-node)    | ^10     | TypeScript execution for dev  |
| [nodemon](https://nodemon.io)                | ^3      | Auto-restart on file changes  |

---

## Architecture

This project follows a **separation of concerns** architecture on both frontend and backend.

### Frontend Layers

```
API layer        → /src/api/           Raw fetch calls, throws on failure
Service layer    → /src/lib/           Data transformation & formatting
Hook layer       → /src/hooks/         State management, loading/error handling
Component layer  → /src/components/    Pure UI, receives props only
Page layer       → /src/pages/         Orchestrates hooks + components
```

### Backend Layers

```
Config           → /src/config/        Env validation, fail-fast on startup
Routes           → /src/routes/        Thin controllers, HTTP input/output only
Services         → /src/services/      Business logic, OpenWeatherMap API calls
Middleware       → /src/middleware/     Global error handling
```

---

## Supported Cities

| City    | Country | ID      |
| ------- | ------- | ------- |
| Toronto | CA      | 6167865 |
| Ottawa  | CA      | 6094817 |
| Tokyo   | JP      | 1850147 |

To add more cities, update the `CITIES` array in `client/src/hooks/useWeatherDashboard.ts`.

---

## Environment Variables

### Server (`server/.env`)

| Variable                  | Required | Description                   |
| ------------------------- | -------- | ----------------------------- |
| `PORT`                    | No       | Server port (default: `3000`) |
| `OPENWEATHERMAP_API_KEY`  | ✅ Yes   | Your OpenWeatherMap API key   |
| `OPENWEATHERMAP_BASE_URL` | ✅ Yes   | API base URL                  |

### Client (`client/.env.development`)

| Variable            | Required | Description        |
| ------------------- | -------- | ------------------ |
| `VITE_API_BASE_URL` | ✅ Yes   | Backend server URL |

---

## Available Scripts

### Server

| Script          | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start dev server with nodemon + ts-node |
| `npm run build` | Compile TypeScript to `dist/`           |
| `npm run start` | Run compiled production build           |

### Client

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite dev server            |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint                       |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org):

```
feat:     new feature
fix:      bug fix
chore:    maintenance, dependencies
refactor: code restructure without behavior change
docs:     documentation updates
style:    formatting, no logic change
```

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org) for the weather data API
- [shadcn/ui](https://ui.shadcn.com) for the component system
- [Lucide](https://lucide.dev) for the icon set
