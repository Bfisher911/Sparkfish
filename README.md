# Sparkfish LLC - Web Application

An end-to-end full-stack marketing and learning platform built for Sparkfish LLC to offer AI cohort programs, tracks, and weekend courses.

## Tech Stack
- Frontend: Next.js (App Router), React, Tailwind CSS, shadcn/ui
- Validation: TypeScript, Zod
- Backend & Auth: Supabase (Auth, Postgres, Row Level Security)
- Payments: Stripe (Checkout Sessions, Webhooks)
- Email: Resend
- Certificates: PDFKit (Server-side PDF generation)

## Local Development Setup

### 1. Prerequisite Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the following credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: From Supabase Project Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From Supabase Project Settings > API
- `SUPABASE_SERVICE_ROLE_KEY`: From Supabase Project Settings > API (needed for seed and admin webhooks)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: From Stripe Developer Dashboard
- `STRIPE_SECRET_KEY`: From Stripe Developer Dashboard
- `STRIPE_WEBHOOK_SECRET`: See Stripe CLI setup below.
- `RESEND_API_KEY`: From Resend dashboard. (If left blank, emails fallback to `console.log` in development).

### 2. Database Initialization & Seeding
In your Supabase project (or via local Supabase CLI), run the SQL migration found in `supabase/migrations/0000_schema.sql` via the Supabase Dashboard SQL Editor to establish tables, types, and RLS policies.

Once the schema is set up, run the data seeder:
```bash
npm install
npm run seed
```
This script will pre-populate 3 tracks, 2 flagship programs, several weekend courses, and sample cohorts.

### 3. Stripe Webhooks Setup
To test Stripe locally, you must forward webhook events to your local server.
1. Download Stripe CLI.
2. Run `stripe login`
3. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook signing secret it outputs and set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`

### 4. Running the Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

## Architecture & Flows

### Authentication
Implemented using `@supabase/ssr`. Protected routes include `/dashboard` and `/admin`. The middleware (`src/middleware.ts`) automatically routes unauthenticated users away from protected areas and ensures secure cookie refreshing.

### Registration & Seats
Users click "Enroll Now", creating a Stripe Checkout Session via `/api/stripe/checkout`.
Once payment completes, Stripe hits `/api/stripe/webhook` which securely increments `seats_taken` on the associated cohort, creates an active `enrollment`, and fires a confirmation email via Resend including Zoom credentials.

### Certificates
Admins can navigate to `/admin`, select "Enrollments", and issue a PDF certificate. 
`PDFKit` generates the physical PDF on the server, uploads it to Supabase Storage (bucket: `certificates`), marks the enrollment as `completed`, attaches a random hash code, and automatically emails the user their uniquely verifiable `/certificate/verify/[code]` URL.

### Admin Escalation
To view the `/admin` console, you must first create a user normally via `/signup`, then enter the Supabase SQL editor and update your profile:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com'; 
-- (Or filter by ID)
```

## Production Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Under "Environment Variables", inject ALL the variables listed in your `.env.local`, including the live Stripe keys and live Resend key.
3. Configure your live Stripe webhook endpoint in the Stripe Dashboard to point to `https://your-domain.com/api/stripe/webhook` and listen exclusively for `checkout.session.completed` events. Ensure the production signing secret replaces `STRIPE_WEBHOOK_SECRET` in Vercel.
4. Deploy.

---
**Prepared by Antigravity**  
Advanced Agentic Coding - Complete Prototype Build
