# AdBoard — Lab 3: React SPA with User Management

**Variant 3** — Announcement service (local + public), React + Vite, REST API.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start mock REST API (port 3001) — keep running in terminal 1
npm run mock-api

# 3. Start dev server on localhost:8000 — terminal 2
npm run dev

# 4. Open http://localhost:8000
```

### Test credentials
| Username    | Password  | Role    |
|-------------|-----------|---------|
| admin       | admin123  | Admin   |
| john_doe    | pass1234  | Regular |
| m_kovalenko | pass1234  | Regular |

## Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login form |
| `/` | Auth | All announcements |
| `/public` | Auth | Public announcements |
| `/local` | Auth | Local (city-based) |
| `/my` | Auth | My announcements |
| `/create` | Auth | Create announcement |
| `/announcements/:id` | Auth | Announcement detail |
| `/edit/:id` | Auth | Edit announcement |
| `/users` | Admin | Users list |
| `/users/create` | Admin | Create user |
| `/users/:id` | Admin | User detail |
| `/users/:id/edit` | Admin | Edit user |

## Project Structure

```
lab3/
├── index.html
├── vite.config.js
├── package.json
├── .eslintrc.json          ← ESLint airbnb + react, 4-space indent
├── db.json                 ← Mock REST API (json-server)
└── src/
    ├── main.jsx            ← Entry: providers + BrowserRouter
    ├── App.jsx             ← Routes definition
    ├── styles/
    │   └── main.css
    ├── api/
    │   ├── client.js       ← window.fetch wrapper
    │   ├── usersApi.js     ← Users CRUD endpoints
    │   └── announcementsApi.js
    ├── hooks/
    │   ├── useAuth.jsx     ← AuthContext + login/logout
    │   ├── useNotify.js    ← Toast notification state
    │   └── useNotifyContext.jsx
    ├── utils/
    │   ├── format.js       ← formatDate, formatDatetime, getInitials
    │   └── validate.js     ← Form validation rules
    ├── components/
    │   ├── common/
    │   │   ├── Loader.jsx
    │   │   ├── Alert.jsx
    │   │   ├── NotificationContainer.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   └── FormField.jsx
    │   ├── layout/
    │   │   ├── AppLayout.jsx   ← Shell: Header + Sidebar + <Outlet>
    │   │   ├── Header.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── RequireAuth.jsx ← Redirects to /login if not authenticated
    │   │   └── RequireAdmin.jsx
    │   ├── auth/
    │   │   └── LoginForm.jsx
    │   ├── announcements/
    │   │   ├── AnnouncementCard.jsx
    │   │   └── AnnouncementForm.jsx
    │   └── users/
    │       ├── UserAvatar.jsx
    │       ├── UserRoleBadge.jsx
    │       ├── UserTableRow.jsx
    │       └── UserForm.jsx
    └── pages/
        ├── LoginPage.jsx
        ├── AnnouncementsPage.jsx   ← filter prop: all/public/local/my
        ├── AnnouncementDetailPage.jsx
        ├── AnnouncementCreatePage.jsx
        ├── AnnouncementEditPage.jsx
        ├── UsersListPage.jsx
        ├── UserDetailPage.jsx
        ├── UserCreatePage.jsx
        ├── UserEditPage.jsx
        └── NotFoundPage.jsx
```

## Requirements Checklist

- ✅ React 18 + React Router v6 + Vite
- ✅ Accessible on `localhost:8000`
- ✅ Login / logout with session persistence (sessionStorage)
- ✅ User roles: Admin sees /users routes; Regular user is blocked
- ✅ Users listing with search and role filter
- ✅ User CRUD: create, read, update, delete with confirm dialog
- ✅ Page refresh works — BrowserRouter with real URLs
- ✅ REST API via `window.fetch`, JSON exchange
- ✅ No errors in console
- ✅ No commented-out code
- ✅ ESLint airbnb config, 4-space indent
- ✅ Single responsibility — one component/service per file
- ✅ Files ≤ 400 lines, functions ≤ 75 lines
- ✅ Consistent naming (PascalCase components, camelCase utils)
- ✅ No logic in templates (computed values in component body)
- ✅ Works in Chrome, Firefox, Safari, Edge

## Git Branch

Branch: `lab3` → merge to `development` via pull request.
