# iWealth Frontend

React + TypeScript + Vite frontend for the iWealth fund analytics demo.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (usually `http://localhost:5173`).

## What this app does
- Renders the portfolio overview, fund analysis, and fund comparison screens.
- Uses demo data for the portfolio overview.
- Connects to the backend API at `http://localhost:8000` for fund analytics and comparison.

## Available commands
- `npm run dev` — start the development server
- `npm run build` — build production assets
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Project structure

```
frontend/
├── src/
│   ├── api/              # API client wrappers
│   ├── components/       # UI components and layout
│   ├── pages/            # Main screens
│   ├── types/            # TypeScript models
│   └── utils/            # Formatting helpers
├── public/               # Static assets
├── package.json          # Frontend dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Notes
- `frontend/src/pages/PortfolioOverview.tsx` currently uses dummy portfolio data.
- Fund analysis and comparison pages are designed to display backend-driven metrics.
- See `backend/README.md` for backend setup.
- See `docs/Part4_Design_Document.md` for product and AI-layer design notes.

## AI Usage
- Intial Structure was created using ChatGPT to place all components together according to the design or UI plan
- Cursor is used to beautify and place all components for a production ready UI