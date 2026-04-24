# WeatherDash

A full-stack weather dashboard application built with **React + Vite** for the frontend and **Node.js + Express + TypeScript** for the backend. The app consumes OpenWeatherMap data and serves a responsive weather dashboard with current conditions, forecast details, and temperature toggles.

---

## Features

- Current weather for selected cities
- 5-day weather forecast
- City selection with persisted last-place state
- Celsius / Fahrenheit toggle
- Loading skeletons and error handling
- Responsive layout for desktop and mobile

---

## Project Structure

```
webAppWeatherDash/
├── client/                       # React + Vite frontend
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/                  # Raw fetch layer for backend calls
│   │   ├── assets/               # Images, icons, fonts
│   │   ├── components/
│   │   │   ├── core/             # Core UI components
│   │   │   ├── features/         # Feature components
│   │   │   └── ui/               # Reusable UI primitives
│   │   ├── config/               # Environment validation
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility helpers
│   │   ├── pages/                # Page-level components
│   │   └── types/                # TypeScript types
│   ├── .env                     # Frontend environment file (gitignored)
│   ├── .env.example             # Environment template
│   ├── package.json
│   └── vite.config.ts
├── server/                       # Node.js + Express backend
│   ├── src/
│   │   ├── config/               # Env validation and startup config
│   │   ├── middleware/           # Error handling middleware
│   │   ├── routes/               # Express route handlers
│   │   └── services/             # OpenWeatherMap service logic
│   ├── .env                     # Server environment file (gitignored)
│   ├── .env.example             # Environment template
│   └── package.json
├── package.json                 # Root workspace scripts
└── README.md
```

---

## Prerequisites

| Tool                   | Version                                        |
| ---------------------- | ---------------------------------------------- |
| Node.js                | >= 18                                          |
| npm                    | Latest supported version                       |
| OpenWeatherMap API Key | [Get one free](https://openweathermap.org/api) |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pfiterman/webAppWeatherDash.git
cd webAppWeatherDash
```

### 2. Install dependencies

```bash
npm install
```

This installs dependencies for both the `client` and `server` workspaces.

### 3. Configure the backend

```bash
cd server
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=3000
OPENWEATHERMAP_API_KEY=your_api_key_here
OPENWEATHERMAP_BASE_URL=https://api.openweathermap.org/data/2.5
```

### 4. Configure the frontend

```bash
cd ../client
cp .env.example .env
```

Fill in your `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Running the App

### Run both server and client together

From the repository root:

```bash
npm run dev
```

### Run the server only

```bash
cd server
npm run dev
```

### Run the client only

```bash
cd client
npm run dev
```

---

## Build and Production

### Build both workspaces from the root

```bash
npm run build
```

### Start the compiled backend from the root

```bash
npm run start
```

### Preview the frontend production build

```bash
cd client
npm run preview
```

---

## API Endpoints

| Method | Endpoint                            | Description                |
| ------ | ----------------------------------- | -------------------------- |
| `GET`  | `/health`                           | Server health check        |
| `GET`  | `/api/weather/current?id={cityId}`  | Current weather by city ID |
| `GET`  | `/api/weather/forecast?id={cityId}` | 5-day forecast by city ID  |

### Example requests

```bash
curl "http://localhost:3000/health"
curl "http://localhost:3000/api/weather/current?id=6167865"
curl "http://localhost:3000/api/weather/forecast?id=1850147"
```

---

## Available Scripts

### Root

| Script          | Description                             |
| --------------- | --------------------------------------- |
| `npm install`   | Install all workspace dependencies      |
| `npm run dev`   | Start the frontend and backend together |
| `npm run build` | Build both client and server            |
| `npm run start` | Run the compiled backend                |

### Client

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start Vite dev server           |
| `npm run build`   | Build the client for production |
| `npm run preview` | Preview the production build    |
| `npm run lint`    | Run ESLint                      |

### Server

| Script          | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the server in development    |
| `npm run build` | Compile TypeScript to `dist/`      |
| `npm run start` | Run the compiled production server |

---

## Environment Variables

### Server (`server/.env`)

| Variable                  | Required | Description                   |
| ------------------------- | -------- | ----------------------------- |
| `PORT`                    | No       | Server port (default: `3000`) |
| `OPENWEATHERMAP_API_KEY`  | Yes      | OpenWeatherMap API key        |
| `OPENWEATHERMAP_BASE_URL` | Yes      | OpenWeatherMap base URL       |

### Client (`client/.env`)

| Variable            | Required | Description        |
| ------------------- | -------- | ------------------ |
| `VITE_API_BASE_URL` | Yes      | Backend server URL |

---

## Supported Cities

| City    | Country | ID      |
| ------- | ------- | ------- |
| Toronto | CA      | 6167865 |
| Ottawa  | CA      | 6094817 |
| Tokyo   | JP      | 1850147 |

To add more cities, update the `CITIES` array in `client/src/hooks/useWeatherDashboard.ts`.

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feat/your-feature`
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
