# 🌍 VisitIran Tourism Platform

A modern, full-stack tourism booking platform built with **Next.js 16**, **TypeScript**, **Prisma ORM**, and **SQLite/LibSQL** — designed to showcase and book tours across Iran's provinces.

---

## ✨ Features

- 🗺️ **Tour Browsing** — Browse tours by province, type (Mountain, Forest, City, Village, Nature), and difficulty
- 📅 **Booking System** — Full booking flow with guest info, optional services (transport, accommodation, insurance, visa), and coupon support
- 💳 **Stripe Integration** — Online payment via Stripe Checkout
- 👤 **User Roles** — `USER`, `GUIDE`, `ADMIN`, `SUPER_ADMIN` with role-based access
- 🌐 **Multi-language** — Content fields in Persian (FA), English (EN), Arabic (AR), Russian (RU), Chinese (ZH), Spanish (ES)
- 📝 **Articles/Blog** — Travel articles with categories, tags, and publishing workflow
- ❤️ **Wishlist** — Users can save favorite tours
- ⭐ **Reviews** — Verified, approved reviews with pros/cons and helpful counts
- 🗓️ **Past Tours Archive** — Gallery and notes from completed tours
- 📣 **Slider/Banner** — Admin-managed homepage sliders
- 📬 **Newsletter & Contact** — Email subscription and contact message system
- 🗺️ **Interactive Maps** — Leaflet + React Leaflet for tour locations
- 📧 **Email Notifications** — Nodemailer integration for booking confirmations
- 🛠️ **Admin Panel** — Full CRUD management at `/admin`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| ORM | Prisma 7 |
| Database | SQLite (LibSQL / Turso-compatible) |
| Auth | JWT + bcryptjs |
| Payments | Stripe |
| Maps | Leaflet + React Leaflet |
| Email | Nodemailer |

---

## 📁 Project Structure

```
bagherghardeshghari/
├── frontend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database models
│   │   ├── seed.ts            # Sample data seeder
│   │   └── migrations/        # DB migration history
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/        # Login / Register pages
│   │   │   ├── (main)/        # Public-facing pages
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── booking/       # Booking flow
│   │   │   └── api/           # Next.js API routes
│   │   ├── components/        # Shared UI components
│   │   ├── context/           # React Context providers
│   │   ├── lib/               # Prisma client, helpers
│   │   ├── messages/          # i18n translation files
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   ├── next.config.ts
│   ├── tailwind.config
│   └── package.json
└── start.bat                  # Windows quick-start script
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/salehkheiri1995-png/bagherghardeshghari.git
cd bagherghardeshghari/frontend

# Install dependencies
npm install

# Set up the database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

App runs at **http://localhost:3000**

### Windows Quick Start

Double-click `start.bat` in the root directory — it automatically installs dependencies if needed and starts the dev server.

---

## 🗄️ Database Commands

```bash
npm run db:migrate    # Run migrations (dev)
npm run db:push       # Push schema changes directly
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio GUI
npm run db:generate   # Regenerate Prisma Client
```

---

## 📊 Data Models

The platform includes the following core models:

- **User** — Authentication, roles, profile
- **Tour** — Full tour details with multilingual fields, pricing, itinerary
- **TourDate** — Available dates per tour with capacity management
- **Province** — Iran's provinces with geolocation
- **Attraction** — Tourist attractions linked to provinces and tours
- **Booking** — Reservations with payment tracking and optional services
- **Review** — Star ratings, comments, verified status
- **Article** — Blog/travel articles with publishing workflow
- **Media** — Photos and videos for tours
- **PastTour** — Archive of completed tours with gallery
- **Wishlist** — User's saved tours
- **Coupon** — Discount codes with usage limits
- **Slider** — Homepage banner management
- **Newsletter / ContactMessage** — Communication models
- **Translation** — Dynamic i18n key-value store

---

## 🌐 Multilingual Support

All major content fields support translations in:
`FA` (Persian) · `EN` (English) · `AR` (Arabic) · `RU` (Russian) · `ZH` (Chinese) · `ES` (Spanish)

---

## 🔑 Environment Variables

Create a `.env` file inside `frontend/`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your@email.com"
SMTP_PASS="your-password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📄 License

This project is private. All rights reserved © 2025 Bagher Ghardeshghari.
