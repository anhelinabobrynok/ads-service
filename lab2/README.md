# AdBoard — Lab 2: Client-Server Interaction (Pure JS, AJAX, ESLint)

**Variant 3** — Announcement service with local and public announcements.

## Quick Start

```bash
# 1. Install dependencies (ESLint only — no runtime deps)
npm install

# 2. Start mock REST API on port 3001
npm run mock-api
# → json-server serves public/data/db.json as REST API

# 3. Serve the SPA on port 3000 (separate terminal)
npm start

# 4. Open http://localhost:3000 in your browser

# 5. Run linter
npm run lint
```

### Test credentials
| Username   | Password   | Role    |
|------------|------------|---------|
| admin      | admin123   | Admin   |
| john_doe   | pass1234   | Regular |
| m_kovalenko| pass1234   | Regular |

## API Endpoints Used (≥ 3 required)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/announcements` | Fetch all announcements (with query filters) |
| 2 | GET | `/announcements/:id` | Fetch single announcement |
| 3 | POST | `/announcements` | Create announcement |
| 4 | PUT | `/announcements/:id` | Update announcement |
| 5 | DELETE | `/announcements/:id` | Delete announcement |
| 6 | GET | `/users` | Fetch all users (admin) |
| 7 | GET | `/users/:id` | Fetch single user |
| 8 | POST | `/users` | Create user (admin) |
| 9 | PUT | `/users/:id` | Update user (admin) |
| 10| DELETE | `/users/:id` | Delete user (admin) |
| 11| GET | `/users?username=…` | Authenticate (login) |

## Project Structure

```
lab2/
├── index.html               ← SPA shell (single HTML file)
├── package.json             ← npm project config + lint script
├── .eslintrc.json           ← ESLint airbnb-base config (as required)
├── public/
│   ├── css/main.css         ← Stylesheet (from lab1 SCSS)
│   └── data/db.json         ← Mock REST API database (json-server)
└── src/
    ├── main.js              ← Entry point: router wiring + auth guards
    ├── api/
    │   ├── client.js        ← Base fetch wrapper (window.fetch, JSON)
    │   ├── announcements.js ← Announcements API (endpoints 1–5)
    │   └── users.js         ← Users API (endpoints 6–11)
    ├── utils/
    │   ├── router.js        ← Hash-based SPA router with :param support
    │   ├── auth.js          ← Session auth (sessionStorage)
    │   ├── dom.js           ← DOM helpers + notify utility
    │   ├── validate.js      ← Form validation rules
    │   └── format.js        ← Date formatting
    └── components/
        ├── shell.js         ← Header + sidebar rendering
        ├── loader.js        ← Loading spinner + error state
        ├── announcementCard.js   ← Announcement card HTML component
        ├── announcementsList.js  ← List page (all/public/local/my)
        ├── announcementDetail.js ← Detail page
        ├── announcementForm.js   ← Create/edit form
        ├── usersPage.js     ← Users list (admin)
        ├── userPages.js     ← User info + user create/edit form
        └── loginPage.js     ← Login form
```

## Requirements Checklist

- ✅ Pure JS — no jQuery or other runtime libraries
- ✅ `window.fetch` used for all AJAX calls
- ✅ Code passes ESLint (airbnb-base config)
- ✅ 11 API endpoints used (≥ 3 required)
- ✅ Initialized as npm project (`package.json`)
- ✅ REST interface with JSON data exchange
- ✅ No errors or logs in console
- ✅ Loading < 4 seconds (local API, no heavy deps)
- ✅ Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ No commented-out code
- ✅ `npm run lint` — ESLint with airbnb-base
- ✅ SPA with hash-based routing
- ✅ Auth guard — unauthenticated users redirected to /login
- ✅ Admin guard — non-admin users blocked from /users routes

## Git Branch

Work for this lab is on branch `lab2`.
After completion: merge to `development` via pull request. Do not delete branch.

## Linter Config

As per lab requirements — `.eslintrc.json`:
- `eslint: ^6.8.0`
- `eslint-config-airbnb-base: ^14.0.0`
- `eslint-plugin-import: ^2.20.1`
- Indent: 4 spaces
- linebreak-style: off (Windows compatible)
- ecmaVersion: 2018, sourceType: module
