This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contact Form Email Setup

To send contact form submissions to `contact@coopradiong.com`, configure these environment variables in `.env.local`:

```bash
SMTP_HOST=your.smtp.host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
CONTACT_FROM=your_from_email
CONTACT_TO=contact@coopradiong.com
```

If `CONTACT_TO` is not set, the app defaults to `contact@coopradiong.com`.

## Admin Portal + Database Setup (Phase 1)

1. Copy `.env.example` values into `.env.local` and set:

- `DATABASE_URL`
- `ADMIN_AUTH_SECRET`
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`

2. Generate Prisma client:

```bash
npm run prisma:generate
```

3. Create database tables:

```bash
npm run prisma:migrate
```

4. Seed the first admin user and default public site settings:

```bash
npm run prisma:seed
```

5. Start the app and sign in at `/admin/login`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
