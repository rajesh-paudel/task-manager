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
- **Image Upload:** Cloudinary
- **Bot Protection:** Cloudflare Turnstile
- **SEO:** react-helmet-async
- **Deployment:** Vercel

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
├── api/            # Firebase interaction layer (CRUD functions)
├── assets/         # Static assets
├── components/     # Reusable components
│   ├── layout/     # Navbar, Footer
│   ├── ui/         # ErrorBoundary, ThemeToggle, PriorityBadge, route guards
│   └── Dashboard/  # Overview, Tasks, Admin, Layout, TaskModal, TaskDetailModal
├── context/        # ThemeContext (dark/light)
├── hooks/          # useTasksSync, useEditableField
├── Pages/          # Home, Login, Register, Profile, Contact, About, Pricing, NotFound
├── store/          # Redux: authSlice, taskSlice, tasksSelectors, store
├── types/          # task.ts, user.ts
└── utils/          # firebaseConfig, cloudinary, dateHelpers
```

## Architecture & Conventions
- Routes are **lazy-loaded** with `React.lazy` + `Suspense`
- Auth state syncs via `onAuthStateChanged` → Redux `authSlice`
- Firebase Realtime DB path: `users/{uid}` for user profiles
- Role-based access: `role === "admin"` for admin panel, `role === "user"` for regular users
- Dashboard routes are **nested** under `/dashboard` with a shared `DashboardLayout`
- Theme toggling via `ThemeContext` with Tailwind dark mode classes
- Components are **default-exported** function components, PascalCase filenames
- Utilities/hooks use **named exports**, camelCase filenames
- Never call Firebase (`onValue`, `ref`, `push`, etc.) directly in components — use `api/tasks.ts` functions and `useTasksSync` hook
- Never use `@/` path aliases — relative imports only (e.g. `../types/user`)

## Component Location Rules
```
src/Pages/           → Route-level pages (one per route)
src/components/layout/   → Navbar, Footer
src/components/ui/       → ErrorBoundary, ThemeToggle, PriorityBadge, route guards
src/components/Dashboard/ → Dashboard-specific: Overview, Tasks, Admin, Layout, TaskModal, TaskDetailModal
src/components/Home/     → Landing page sections only
```

## Styling Convention
- **Tailwind utility classes only** — no CSS modules, styled-components, CSS-in-JS, or separate CSS files
- Dark mode uses `dark:` prefix (e.g. `dark:bg-slate-900`)
- Theme toggled by adding/removing `dark` class on `<html>` via ThemeContext
- No `@apply` directives or custom CSS classes
- Color palette: indigo for primary actions, orange for accents/warnings, slate for neutrals

## Route Map
```
/                   → Home (public)
/login              → Login (public, redirects to /dashboard if authenticated)
/register           → Register (public, redirects to /dashboard if authenticated)
/contact            → Contact (public)
/about              → About (public)
/pricing            → Pricing (public)
/profile            → Profile (protected)
/dashboard          → DashboardLayout (protected, noindex)
  /dashboard/overview   → Overview (stats + charts)
  /dashboard/tasks      → Tasks (list/kanban CRUD)
  /dashboard/admin      → Admin panel (role === "admin" only)
*                   → NotFound
```

## Data Flow

### Auth Flow
1. `onAuthStateChanged` in App.tsx listens to Firebase Auth
2. On login: fetches profile from Realtime DB `users/{uid}` via `onValue`
3. Dispatches `setProfile(userProfile)` or `clearProfile()` to Redux
4. Components read from `useAppSelector((state) => state.auth)`

### Task Sync Flow
1. `useTasksSync(uid)` hook subscribes to Firebase `tasks/{uid}` via `onValue`
2. On data change: dispatches `tasksReceived(record)` to Redux
3. On error: dispatches `tasksError(message)`
4. On logout: dispatches `tasksCleared()`
5. Components read via selectors (`selectAllTasks`, `selectTaskStats`, etc.)

### Task CRUD Flow
- **Create:** `createTask(uid, newTask)` → `push` + `set` on `tasks/{uid}`
- **Read:** Realtime via `useTasksSync` → Redux → selectors
- **Update:** `updateTask(uid, task, changes)` → `update` on `tasks/{uid}/{taskId}`
- **Delete:** `deleteTask(uid, taskId)` → `remove` on `tasks/{uid}/{taskId}`

## Firebase Realtime DB Structure
```
/users/{uid}          → UserProfile object
/tasks/{uid}          → Record<string, Task> (keyed by push ID)
/forms/{pushId}       → Contact form submissions
```

## Redux State Shape
```ts
// authSlice
{ userProfile: UserProfile | null, loading: boolean }

// taskSlice
{ items: Record<string, Task>, status: "idle"|"loading"|"synced"|"error", error: string | null }
```

## Key Types
```ts
// UserProfile (stored at /users/{uid})
{ uid: string, name: string, email: string, profileUrl: string,
  title: string, bio: string, role: "admin" | "user", createdAt: number }

// Task (stored at /tasks/{uid}/{taskId})
{ id: string, title: string, description?: string,
  status: "todo" | "in_progress" | "done",
  priority: "low" | "medium" | "high" | "urgent",
  dueDate: number | null, createdAt: number, updatedAt: number,
  completedAt: number | null }
```

## Environment Variables
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_CLOUDINARY_CLOUD_NAME
VITE_TURNSTILE_SITE_KEY
```

## Component Import Rules
- Use **relative imports** only (e.g. `../types/user`, `../../store/store`)
- No `@/` path alias is configured — never use it
- For same-directory imports, use `./ComponentName`

## Error Handling Pattern
- Async Firebase operations use `.catch()` with user-friendly messages
- Realtime DB listeners pass errors to Redux via `tasksError`
- `ErrorBoundary` wraps all routes, shows "Reload page" on crash
- Form validation uses Zod schemas + React Hook Form errors
- Firebase auth errors are translated to readable strings

## Accessibility & SEO
- Use semantic HTML elements (<header>, <nav>, <main>, etc.)
- Every page should have a `<Helmet>` with title + meta tags
- Dashboard and profile pages use `noindex, nofollow`
- Public/robots.txt disallows /dashboard and /profile

## Firebase Interaction Rules
- **Never call Firebase directly in components** (`onValue`, `ref`, `push`, `set`, `update`, `remove`)
- Use `api/tasks.ts` functions for task CRUD (createTask, updateTask, deleteTask)
- Use `useTasksSync(uid)` hook for realtime task syncing
- Auth state flows through Redux — read via `useAppSelector((state) => state.auth)`
