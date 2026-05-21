# AdBoard — Lab 4: Variant-Specific Functionality

Extends Lab 3 with Dashboard, category filter, debounced search.

## Quick Start

```bash
npm install
npm run mock-api   # terminal 1 — API on :3001
npm run dev        # terminal 2 — SPA on localhost:8000
npm run lint       # check code style
```

### Credentials
| Username    | Password  | Role  |
|-------------|-----------|-------|
| admin       | admin123  | Admin |
| john_doe    | pass1234  | Regular |

## New in Lab 4

| Feature | File |
|---------|------|
| Dashboard with stats | `pages/DashboardPage.jsx` |
| Category filter | `pages/AnnouncementsPage.jsx` |
| Debounced search (350ms) | `hooks/useDebounce.js` |
| Generic fetch hook | `hooks/useFetch.js` |
| Updated sidebar | `components/layout/Sidebar.jsx` |

## Git Branch: `lab4`
