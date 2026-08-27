# Task Manager

A task management web app built with React 19, TypeScript, and Firebase.

## Tech Stack


- **Framework:** React 19 + TypeScript + Vite 8
- **Backend:** Firebase Auth + Realtime Database
- **State:** Redux Toolkit
- **Routing:** React Router v7 (lazy-loaded)
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **Image Upload:** Cloudinary
- **Bot Protection:** Cloudflare Turnstile
- **SEO:** react-helmet-async
- **Testing:** Vitest + React Testing Library

## Features

- Firebase Authentication (email/password)
- Role-based dashboards (admin / user)
- Task CRUD with realtime sync
- List, kanban, and calendar views (calendar shows tasks by due date)
- Filters, sorting, search, and JSON/CSV export
- Keyboard shortcuts (`n` new task, `/` focus search)
- Admin panel for user & task management
- Dark/light theme toggle
- Responsive design

## Getting Started

```bash
cp .env.example .env
npm install
npm run dev
```

Fill in the required values in `.env` (see `.env.example` for all needed keys).

## Firebase Database Rules

Database rules are stored in `database.rules.json` and deployed with the Firebase CLI:

```bash
npx firebase-tools login
npx firebase-tools use --add
npm run firebase:deploy
```

Choose the Firebase project that matches `VITE_FIREBASE_PROJECT_ID` when prompted. The deployment script publishes only the Realtime Database rules.

## Commands

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| `npm run dev`             | Start dev server               |
| `npm run build`           | Type-check + build             |
| `npm run lint`            | Run ESLint                     |
| `npm test`                | Run tests (watch mode)         |
| `npm run test:coverage`   | Run tests + coverage report    |
| `npm run preview`         | Preview production build       |
| `npm run firebase:deploy` | Deploy Realtime Database rules |

## Testing

```bash
npm test              # watch mode
npm run test:coverage # run once with coverage report
```

Tests live in `src/__tests__/`. Pure logic (utils, Redux reducers, selectors) is tested with Vitest; components use React Testing Library. No Firebase credentials are needed — the tested code paths don't touch the real database.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, tests, and the production build on every push/PR to `main`.

## Environment Variables

All env vars are listed in `.env.example`. You need Firebase, Cloudinary, and Turnstile credentials.

## Project Structure

```
src/
├── api/            # Firebase interaction layer
├── components/     # Reusable components
├── context/        # React context providers
├── hooks/          # Custom hooks
├── Pages/          # Route-level pages
├── store/          # Redux slices & selectors
├── types/          # TypeScript type definitions
└── utils/          # Firebase config & helpers
```
