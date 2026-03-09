## COOP Radio Redesign + Admin Portal Blueprint

Last updated: 2026-03-08

## 1) Product Direction

Build a professional **radio-first cooperative media platform**:

- Public website = listening, viewing, discovery, trust-building
- Admin portal = content operations (news, shows, schedule, presenters, directory, media)
- Core message = Community + Education + News + Live Broadcast

## 2) What We Can Reuse Immediately (from current codebase)

### Keep and refactor

1. Streaming foundation
   - `app/components/live-video-player.tsx` (HLS + fallback handling)
   - Existing audio stream URLs and player usage in header/livestream page

2. Navigation shell
   - `app/components/site-header.tsx` (can be simplified for new sitemap)
   - `app/layout.tsx` (global metadata + layout wrapper)

3. Data presentation blocks
   - `app/components/directory-table.tsx` and `app/data/directory-data.json`
   - `app/components/portfolio-gallery.tsx` + `app/data/portfolio-data.json` as basis for podcast/replay media listing patterns
   - `app/components/count-up-number.tsx` (for stats blocks)

4. Working API patterns
   - `app/api/contact/route.ts` + `app/components/contact-form.tsx`
   - `app/api/newsletter/route.ts` + `app/components/newsletter-form.tsx`
   - Good server-side validation pattern and mail delivery flow already in place

### Reuse with content and visual rewrite

- `app/page.tsx` should be redesigned to radio-first sections (Now Playing, Program Schedule, Latest News, Featured Shows)
- `app/livestream/page.tsx` can remain but should consume CMS data (current show, host, CTA links)
- `app/aboutus/page.tsx`, `app/portfolio/page.tsx`, `app/contact/page.tsx` are structurally usable but currently hardcoded

### Low-value to carry forward as-is

- `app/components/site-footer.tsx` currently returns `null`; rebuild as proper institutional footer
- Any hardcoded arrays in pages should be replaced with managed content

## 3) Proposed Information Architecture (Public Site)

1. Home
   - Hero + live audio controls
   - Now Playing
   - Featured Programs
   - Latest News
   - Upcoming Events
   - Join Cooperative Movement CTA

2. Listen Live
   - Audio stream, current show, presenter, call-in details, schedule preview

3. Programs
   - Program list + details (presenter, schedule, description, replay episodes)

4. Podcast / Replay
   - Archive by category and date with stream/share/download

5. News & Updates
   - News, announcements, press releases

6. Cooperative Directory
   - Search/filterable list and profile pages

7. Events
   - Upcoming and past events

8. About
   - History, mission, vision, leadership

9. Advertise With Us
   - Media kit, ad packages, inquiry form

10. Membership
   - Benefits, process, application

11. Contact
   - Multi-channel contact and form

## 4) Admin Portal Scope (MVP)

Admin route group: `/admin`

### Modules

1. Dashboard
   - Quick stats (published posts, upcoming shows, latest subscribers)

2. Programs management
   - CRUD programs (title, host, cover image, description, category)

3. Schedule management
   - Day/time slots + “currently live” resolution logic

4. Replay management
   - Upload audio/video links and assign to program/category/date

5. News management
   - Draft/publish workflow for news and announcements

6. Directory management
   - CRUD cooperatives and categories

7. Events management
   - Upcoming events, registration link, status

8. Presenters management
   - Bio, photo, social/contact info

9. Messages & subscribers
   - View contact submissions and newsletter subscriptions

### Access control

- Roles: `super_admin`, `editor`
- Protected admin routes and authenticated API endpoints

## 5) Recommended Technical Approach (Fits Current Stack)

Current stack is already strong for this project: Next.js + Tailwind + API routes + streaming clients.

### Suggested additions

1. Database + ORM
   - PostgreSQL + Prisma

2. Auth
   - NextAuth/Auth.js (email/password or credentials + role checks)

3. File/media storage
   - Cloudinary or S3-compatible storage for thumbnails and media assets

4. Validation
   - Zod schemas reused across admin forms and APIs

5. Optional CMS acceleration path
   - If speed is priority, use headless CMS (Sanity/Strapi) and keep Next.js frontend

## 6) Data Model (MVP entities)

- `User` (role)
- `Program`
- `Presenter`
- `ScheduleSlot`
- `Episode` (replay/podcast)
- `NewsPost`
- `Event`
- `DirectoryEntry`
- `Subscriber`
- `ContactMessage`
- `SiteSetting` (stream URLs, social links, call-in number)

## 7) Implementation Phases

### Phase 1: Foundation

- Introduce DB, Prisma, auth, and admin layout
- Move stream URLs and constants into `SiteSetting`

### Phase 2: Core content migration

- Replace hardcoded homepage/content arrays with database-driven queries
- Wire Programs, Schedule, News, Events in admin and public pages

### Phase 3: Media + replay

- Add episode/replay library and upload flow
- Improve Listen Live and Program detail pages with dynamic metadata

### Phase 4: Operations hardening

- Audit logs, content preview, role permissions, SEO metadata per page

## 8) UI/Brand Direction

- Keep institutional, credible look (cooperative + public service tone)
- Keep green/white with deep neutral accents
- Prioritize readability, hierarchy, and fast mobile playback UX
- Keep sticky/minimized player behavior, but simplify where needed for clarity

## 9) Immediate Next Build Tasks

1. Create `/admin` shell with authentication and role guard
2. Add Prisma schema + migrations for MVP entities
3. Convert homepage to data-driven sections (Now Playing, News, Programs, Events)
4. Build admin CRUD for `Program`, `ScheduleSlot`, `NewsPost`, `Event`
5. Connect existing contact/newsletter APIs to database storage (in addition to email)

---

### Summary

You already have a strong frontend baseline and working stream integrations. The biggest gap is not UI widgets; it is **content architecture and admin control**. Reusing the existing components and replacing hardcoded content with managed entities is the fastest path to a professional, maintainable COOP Radio platform.

