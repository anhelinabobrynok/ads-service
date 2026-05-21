# AdBoard — Lab 5: Unit Tests (Jest + React Testing Library)

Extends Lab 4. Coverage > 70% across all metrics.

## Quick Start

```bash
npm install

# Run tests with coverage report
npm test

# Watch mode
npm run test:watch

# Run app (still works)
npm run mock-api   # terminal 1 → port 3001
npm run dev        # terminal 2 → localhost:8000
```

## Test Tools (devDependencies)

| Tool | Version | Purpose |
|------|---------|---------|
| `jest` | ^29.7.0 | Test runner + Istanbul coverage |
| `jest-environment-jsdom` | ^29.7.0 | Browser DOM simulation |
| `@testing-library/react` | ^15.0.2 | Component rendering |
| `@testing-library/jest-dom` | ^6.4.2 | DOM matchers |
| `@testing-library/user-event` | ^14.5.2 | User interaction |
| `babel-jest` | ^29.7.0 | JSX + ES module transpile |
| `identity-obj-proxy` | ^3.0.0 | CSS mock |

## Test Structure — 28 files

```
src/__tests__/
├── utils/           validate.test.js, format.test.js
├── api/             client.test.js, announcementsApi.test.js, usersApi.test.js
├── hooks/           useDebounce, useNotify, useFetch, useAuth+useNotifyContext
├── components/      Alert, Loader, EmptyState, FormField, ConfirmDialog,
│                    UserBadges, AnnouncementCard, AnnouncementForm, UserForm,
│                    LoginForm, Header, RouteGuards, NotificationContainer,
│                    AppLayout, Sidebar, UserTableRow
└── pages/           Pages(Login+NotFound+Announcements), DashboardPage,
                     AnnouncementDetailPage, AnnouncementPages(Create+Edit),
                     UsersListPage, UserPages(Detail+Create+Edit)
```

## Git Branch: `lab5`
