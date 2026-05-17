# AdBoard — Lab 1: Static Pages Layout

**Variant 3** — Announcement service with two visibility levels (local and public).

## Project Description

AdBoard is a community announcement board where users can post and browse announcements.
Announcements have two visibility levels:

- **Public** — visible to all visitors, including unregistered guests
- **Local** — visible only to registered users in the same city

## Pages

| File | Description |
|------|-------------|
| `index.html` | All announcements listing (main page) |
| `pages/login.html` | Login page with validation errors |
| `pages/public.html` | Public announcements filtered view |
| `pages/local.html` | Local announcements (city-based) |
| `pages/announcement-detail.html` | Single announcement detail view |
| `pages/create-announcement.html` | Create new announcement form |
| `pages/edit-announcement.html` | Edit existing announcement |
| `pages/delete-confirm.html` | Delete announcement confirmation |
| `pages/my-announcements.html` | Current user's announcements list |
| `pages/users.html` | Admin: users list + create user dialog |
| `pages/create-user.html` | Admin: create user form (standalone) |
| `pages/user-info.html` | Admin: selected user detail |
| `pages/edit-user.html` | Admin: edit user form |
| `pages/delete-user.html` | Admin: delete user confirmation |
| `pages/errors.html` | Error notifications + 404 + validation errors |

## SCSS Structure

```
scss/
├── main.scss          ← entry point, imports all partials
├── _variables.scss    ← all color and design token variables
├── _mixins.scss       ← reusable mixins (flex, card, btn-base, input-base, respond-to…)
├── _base.scss         ← reset, typography, keyframe animations
├── _components.scss   ← buttons, form elements, badges, alerts, modal, tabs
├── _layout.scss       ← app shell, header, sidebar, main content, auth page
└── _pages.scss        ← announcement cards, detail, users table, stats, my-list, dropdown
```

## Requirements Covered

### HTML
- ✅ DOCTYPE declared on every page
- ✅ Correct `<html>`, `<head>`, `<body>` structure
- ✅ Meta tags and stylesheet links in `<head>`
- ✅ No inline styles (all via `<link>` to `css/main.css`)
- ✅ Block/inline element nesting respected
- ✅ Double quotation marks for all attribute values
- ✅ Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<time>`
- ✅ `alt` attributes on all images
- ✅ Class names based on context (BEM-style)
- ✅ Code comments explaining each section
- ✅ Lowercase for all element names, attributes, and values

### CSS / SCSS
- ✅ No inline styles
- ✅ No global selectors (`*` only in reset with purpose)
- ✅ Hyphens in all class names
- ✅ Generic font families defined (`sans-serif`, `serif`)
- ✅ `0` values without units
- ✅ Pseudo-classes used: `:hover`, `:focus`, `:visited`, `:active`, `:first-child`, `::before`, `::placeholder`
- ✅ Transitions on interactive elements
- ✅ Animations (`fade-in`, `pulse-border`, `slide-in-right`)
- ✅ Responsive with `@media` breakpoints (sm, md, lg, xl)
- ✅ SCSS with `@use` / partials
- ✅ Variables for **all colors** in `_variables.scss`
- ✅ Separate color variables file
- ✅ Mixins used: `flex-center`, `flex-between`, `card`, `btn-base`, `input-base`, `badge`, `respond-to`, `truncate`, `fade-in`
- ✅ `@extend` used in component classes
- ✅ Nesting limited to 1–2 levels max
- ✅ No duplicate styles
