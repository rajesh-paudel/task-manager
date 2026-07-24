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

## Features

- Firebase Authentication (email/password)
- Role-based dashboards (admin / user)
- Task CRUD with realtime sync
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

## Commands

| Command             | Description                 |
| ------------------- | --------------------------- |
| `npm run dev`       | Start dev server            |
| `npm run build`     | Type-check + build          |
| `npm run lint`      | Run ESLint                  |
| `npm run preview`   | Preview production build    |

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
