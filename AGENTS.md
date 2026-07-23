# Task Manager

## Description
A task management web app built with React + TypeScript. Features Firebase authentication, realtime database, role-based dashboards (user/admin), task CRUD, and dark/light theme.

## Tech Stack
- **Framework:** React 19, TypeScript ~6.0, Vite 8
- **Backend:** Firebase Auth + Realtime Database
- **State:** Redux Toolkit (authSlice, taskSlice)
- **Routing:** React Router v7 (lazy-loaded routes)
- **Styling:** Tailwind CSS v4 (utility classes only — no CSS modules)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure
```
src/
├── api/            # Firebase interaction layer
├── assets/         # Static assets (images, icons)
├── components/     # Reusable components
│   ├── layout/     # Navbar, Footer
│   ├── ui/         # ErrorBoundary, ThemeToggle, PublicRoute, ProtectedRoute
│   └── Dashboard/  # DashboardOverview, DashboardTasks, DashboardAdmin, DashboardLayout
├── context/        # React context providers (ThemeContext)
├── hooks/          # Custom hooks
├── Pages/          # Route-level pages (Home, Login, Register, Profile, Contact, About, Pricing, NotFound)
├── store/          # Redux slices & selectors (authSlice, taskSlice, tasksSelectors)
├── types/          # TypeScript type definitions
└── utils/          # Firebase config & helpers
```

## Architecture & Conventions
- Routes are **lazy-loaded** with `React.lazy` + `Suspense`
- Auth state syncs via `onAuthStateChanged` → Redux `authSlice`
- Firebase Realtime DB path: `users/{uid}` for user profiles
- Role-based access: `role === "admin"` for admin panel, `role === "user"` for regular users
- Dashboard routes are **nested** under `/dashboard` with a shared `DashboardLayout`
- Theme toggling via `ThemeContext` with Tailwind dark mode classes
- Styling uses **Tailwind utility classes** — no CSS modules, styled-components, or CSS-in-JS
- Components are **default-exported** function components
- File naming: PascalCase for components, camelCase for utilities/hooks