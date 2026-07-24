# Copilot Instructions

This project uses AGENTS.md as its single source of truth for project context.
Refer to AGENTS.md for the full project overview, tech stack, architecture, and conventions.

## Key Conventions for Copilot

- Components: default-exported function components, PascalCase filenames
- Utilities/hooks: named exports, camelCase filenames
- Styling: Tailwind utility classes only — no CSS modules or CSS-in-JS
- Imports: relative paths only (no @/ alias)
- Forms: React Hook Form + Zod schemas for validation
- Firebase: Realtime DB paths are `users/{uid}`, `tasks/{uid}`, `forms/{pushId}`
- Redux: components read via `useAppSelector`, dispatch via `useAppDispatch`
- Routes: lazy-loaded with `React.lazy` + `Suspense`
- Every page must have a `<Helmet>` with title + SEO meta tags

When generating new files, follow the existing patterns in the codebase — look at similar files first.
