
<![CDATA[<div dir="rtl">

# 🌍 پلتفرم گردشگری ویزیت‌ایران (VisitIran)

یک پلتفرم کامل و مدرن برای رزرو تور و گردشگری در ایران — ساخته شده با **Next.js 16**، **TypeScript**، **Prisma ORM** و **SQLite/LibSQL**.

این پروژه تمام زیرساخت‌های لازم برای یک سایت گردشگری حرفه‌ای را دارد: از مرور تورها و رزرو آنلاین گرفته تا پرداخت Stripe، پنل ادمین کامل، داشبورد کاربری، نقشه تعاملی و پشتیبانی از ۶ زبان مختلف.

---

## 📑 فهرست مطالب

- [ویژگی‌ها](#-ویژگیها)
- [تکنولوژی‌ها](#%EF%B8%8F-تکنولوژیها)
- [ساختار پروژه](#-ساختار-پروژه)
- [صفحات و مسیرها](#-صفحات-و-مسیرها)
- [API Routes](#-api-routes)
- [مدل‌های دیتابیس](#-مدلهای-دیتابیس)
- [پشتیبانی چندزبانه](#-پشتیبانی-چندزبانه)
- [نصب و راه‌اندازی](#-نصب-و-راهاندازی)
- [دستورات دیتابیس](#%EF%B8%8F-دستورات-دیتابیس)
- [متغیرهای محیطی](#-متغیرهای-محیطی)
- [نقش‌های کاربری](#-نقشهای-کاربری)
- [نکات مهم](#%EF%B8%8F-نکات-مهم)

---

## ✨ ویژگی‌ها

### 🏕️ مدیریت تور
- مرور تورها بر اساس استان، نوع (کوه، جنگل، شهر، روستا، طبیعت) و سطح دشواری
- صفحه جزئیات کامل تور با گالری تصاویر، برنامه سفر (itinerary)، امکانات شامل/غیرشامل
- فیلتر تورهای ویژه (Featured) و آرشیو تورهای گذشته با گزارش کامل
- مدیریت تاریخ‌های موجود تور با ظرفیت، قیمت ویژه و یادداشت

### 📅 سیستم رزرو
- فرآیند رزرو کامل با اطلاعات مهمان، تعداد نفرات و درخواست‌های ویژه
- سرویس‌های اختیاری: **حمل‌ونقل**، **اقامت**، **بیمه**، **ویزا**
- اعمال کد تخفیف (Coupon) با محدودیت استفاده و حداقل خرید
- ردیابی وضعیت رزرو: PENDING → CONFIRMED → COMPLETED / CANCELLED

### 💳 پرداخت آنلاین
- یکپارچه‌سازی کامل با **Stripe Checkout**
- ذخیره `stripeSessionId` و `paymentIntentId` برای ردیابی تراکنش‌ها
- ثبت زمان‌های دقیق پرداخت، تأیید و تکمیل رزرو

### 👤 احراز هویت و کاربران
- ثبت‌نام و ورود با **JWT** + **bcryptjs**
- پروفایل کاربری با آواتار، کشور، شماره تلفن، بیوگرافی
- داشبورد کاربری شامل: **رزروها**، **علاقه‌مندی‌ها**، **ویرایش پروفایل**

### 🗺️ نقشه تعاملی
- نمایش موقعیت جغرافیایی تورها و جاذبه‌ها روی نقشه با **Leaflet + React Leaflet**
- ذخیره `latitude` و `longitude` برای استان‌ها، تورها و جاذبه‌های گردشگری

### 📝 وبلاگ و مقالات
- سیستم مقاله با دسته‌بندی، برچسب‌ها، تصویر و نویسنده
- فرآیند انتشار با قابلیت Featured و زمان‌بندی انتشار
- شمارنده بازدید مقالات

### ⭐ نظرات و امتیازدهی
- نظرات با امتیاز ستاره، نقاط قوت (pros) و ضعف (cons)
- سیستم تأیید نظرات توسط ادمین (isApproved, isVerified)
- شمارنده مفید بودن نظر (helpfulCount)

### 🛠️ پنل ادمین کامل
- داشبورد آماری (تعداد رزروها، کاربران، درآمد و...)
- مدیریت تورها، تاریخ‌های تور، رزروها، کاربران، نظرات، مقالات، تورهای گذشته
- مدیریت اسلایدرهای صفحه اصلی

### 📣 ارتباطات
- سیستم خبرنامه ایمیل با مدیریت اشتراک
- فرم تماس با ما + ردیابی خوانده‌شده/پاسخ‌داده‌شده
- ارسال ایمیل تأییدیه رزرو با **Nodemailer**

### 🔍 SEO
- کامپوننت `SEOHead.tsx` برای تگ‌های meta سفارشی
- JSON-LD برای داده‌های ساخت‌یافته (Schema.org)
- `sitemap.ts` و `robots.ts` خودکار

---

## 🛠️ تکنولوژی‌ها

| لایه | تکنولوژی |
|------|-----------|
| فریمورک | Next.js 16 (App Router) |
| زبان | TypeScript 5 |
| استایل | Tailwind CSS 4 |
| ORM | Prisma 7 |
| دیتابیس | SQLite (LibSQL / سازگار با Turso) |
| احراز هویت | JWT + bcryptjs |
| پرداخت | Stripe |
| نقشه | Leaflet + React Leaflet |
| ایمیل | Nodemailer |
| Linting | ESLint 9 |

---

## 📁 ساختار پروژه

```
bagherghardeshghari/
├── frontend/
│   ├── prisma/
│   │   ├── schema.prisma         ← تعریف کامل مدل‌های دیتابیس
│   │   ├── seed.ts               ← داده‌های نمونه برای توسعه
│   │   └── migrations/           ← تاریخچه migration ها
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/           ← صفحات ورود / ثبت‌نام
│   │   │   ├── (main)/           ← صفحات عمومی سایت
│   │   │   │   ├── about/        ← درباره ما
│   │   │   │   ├── blog/         ← وبلاگ و مقالات
│   │   │   │   ├── contact/      ← تماس با ما
│   │   │   │   ├── dashboard/    ← داشبورد کاربری
│   │   │   │   │   ├── bookings/ ← رزروهای کاربر
│   │   │   │   │   ├── profile/  ← ویرایش پروفایل
│   │   │   │   │   └── wishlist/ ← علاقه‌مندی‌ها
│   │   │   │   ├── map/          ← نقشه تعاملی تورها
│   │   │   │   └── tours/        ← لیست و جزئیات تورها
│   │   │   ├── admin/            ← پنل مدیریت
│   │   │   │   ├── tours/        ← مدیریت تورها
│   │   │   │   ├── tour-dates/   ← مدیریت تاریخ‌های تور
│   │   │   │   ├── bookings/     ← مدیریت رزروها
│   │   │   │   ├── users/        ← مدیریت کاربران
│   │   │   │   ├── reviews/      ← مدیریت نظرات
│   │   │   │   ├── articles/     ← مدیریت مقالات
│   │   │   │   └── past-tours/   ← آرشیو تورهای گذشته
│   │   │   ├── api/              ← Next.js API Routes
│   │   │   │   ├── auth/         ← ورود، ثبت‌نام، توکن
│   │   │   │   ├── tours/        ← CRUD تورها
│   │   │   │   ├── bookings/     ← ایجاد و مدیریت رزرو
│   │   │   │   ├── payment/      ← Stripe Checkout
│   │   │   │   ├── reviews/      ← ثبت و مدیریت نظرات
│   │   │   │   ├── contact/      ← ارسال پیام تماس
│   │   │   │   ├── newsletter/   ← عضویت در خبرنامه
│   │   │   │   ├── upload/       ← آپلود فایل/تصویر
│   │   │   │   └── admin/        ← API های اختصاصی ادمین
│   │   │   ├── booking/          ← فرآیند رزرو (صفحات)
│   │   │   ├── page.tsx          ← صفحه اصلی
│   │   │   ├── layout.tsx        ← Layout اصلی
│   │   │   ├── error.tsx         ← مدیریت خطا
│   │   │   ├── not-found.tsx     ← صفحه 404
│   │   │   ├── loading.tsx       ← صفحه لودینگ
│   │   │   ├── sitemap.ts        ← Sitemap خودکار
│   │   │   └── robots.ts         ← Robots.txt خودکار
│   │   ├── components/
│   │   │   ├── layout/           ← Header، Footer، Navbar
│   │   │   ├── map/              ← کامپوننت‌های نقشه
│   │   │   ├── SEOHead.tsx       ← تگ‌های meta سفارشی
│   │   │   ├── json-ld.tsx       ← Schema.org JSON-LD
│   │   │   ├── LazyLoad.tsx      ← بارگذاری تنبل
│   │   │   └── Providers.tsx     ← React Context Providers
│   │   ├── context/              ← Context های React
│   │   ├── lib/                  ← Prisma client، هلپرها
│   │   ├── messages/             ← فایل‌های ترجمه (i18n)
│   │   ├── types/                ← تعاریف TypeScript
│   │   └── utils/                ← توابع کمکی
│   ├── public/                   ← فایل‌های استاتیک
│   ├── next.config.ts
│   ├── tailwind.config
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   └── package.json
└── start.bat                     ← اجرای سریع ویندوز
```

---

## 🗺️ صفحات و مسیرها

| مسیر | توضیح |
|------|-------|
| `/` | صفحه اصلی با اسلایدر و تورهای ویژه |
| `/tours` | لیست تمام تورها با فیلتر و جستجو |
| `/tours/[slug]` | صفحه جزئیات تور |
| `/booking` | فرآیند رزرو تور |
| `/map` | نقشه تعاملی تورها و جاذبه‌ها |
| `/blog` | لیست مقالات |
| `/blog/[slug]` | صفحه مقاله |
| `/about` | درباره ما |
| `/contact` | تماس با ما |
| `/dashboard` | داشبورد کاربری |
| `/dashboard/bookings` | رزروهای کاربر |
| `/dashboard/wishlist` | علاقه‌مندی‌های کاربر |
| `/dashboard/profile` | ویرایش پروفایل |
| `/admin` | پنل ادمین (داشبورد آماری) |
| `/admin/tours` | مدیریت تورها |
| `/admin/tour-dates` | مدیریت تاریخ‌های تور |
| `/admin/bookings` | مدیریت رزروها |
| `/admin/users` | مدیریت کاربران |
| `/admin/reviews` | مدیریت نظرات |
| `/admin/articles` | مدیریت مقالات |
| `/admin/past-tours` | آرشیو تورهای گذشته |

---

## 🔌 API Routes

| endpoint | متد | توضیح |
|----------|-----|-------|
| `/api/auth/register` | POST | ثبت‌نام کاربر جدید |
| `/api/auth/login` | POST | ورود و دریافت JWT |
| `/api/tours` | GET | دریافت لیست تورها |
| `/api/tours/[id]` | GET/PUT/DELETE | عملیات روی تور خاص |
| `/api/bookings` | GET/POST | رزرو جدید / لیست رزروها |
| `/api/payment` | POST | ایجاد Stripe Checkout Session |
| `/api/reviews` | GET/POST | نظرات تور |
| `/api/contact` | POST | ارسال پیام تماس |
| `/api/newsletter` | POST | عضویت در خبرنامه |
| `/api/upload` | POST | آپلود تصویر/فایل |
| `/api/admin/*` | * | API های محافظت‌شده ادمین |

---

## 📊 مدل‌های دیتابیس

پروژه شامل **۱۵ مدل** اصلی در Prisma است:

| مدل | توضیح |
|-----|-------|
| `User` | کاربران با نقش‌های مختلف و پروفایل کامل |
| `Tour` | تورها با جزئیات کامل، چندزبانه، قیمت‌گذاری و برنامه سفر |
| `TourDate` | تاریخ‌های موجود هر تور با مدیریت ظرفیت |
| `Province` | استان‌های ایران با موقعیت جغرافیایی و چندزبانه |
| `Attraction` | جاذبه‌های گردشگری مرتبط با استان‌ها و تورها |
| `TourAttraction` | ارتباط Many-to-Many بین تور و جاذبه |
| `Booking` | رزروها با ردیابی کامل پرداخت و وضعیت |
| `PastTour` | آرشیو تورهای انجام‌شده با گالری و گزارش |
| `Media` | تصاویر و ویدیوهای تورها |
| `Review` | نظرات و امتیازات کاربران |
| `Article` | مقالات وبلاگ با workflow انتشار |
| `Wishlist` | علاقه‌مندی‌های کاربران |
| `Coupon` | کدهای تخفیف با محدودیت استفاده |
| `Slider` | اسلایدرهای صفحه اصلی |
| `Newsletter` | اشتراک خبرنامه ایمیل |
| `ContactMessage` | پیام‌های تماس با ما |
| `Translation` | ذخیره‌سازی پویای ترجمه‌ها (key-value) |

---

## 🌐 پشتیبانی چندزبانه

تمام فیلدهای محتوایی اصلی در ۶ زبان پشتیبانی می‌کنند:

| کد | زبان |
|----|------|
| `FA` | فارسی |
| `EN` | انگلیسی |
| `AR` | عربی |
| `RU` | روسی |
| `ZH` | چینی |
| `ES` | اسپانیایی |

علاوه بر این، مدل `Translation` برای ذخیره ترجمه‌های پویا در دیتابیس وجود دارد.

---

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- **Node.js** نسخه ۱۸ یا بالاتر
- **npm** نسخه ۹ یا بالاتر

### نصب

```bash
# کلون کردن ریپوزیتوری
git clone https://github.com/salehkheiri1995-png/bagherghardeshghari.git
cd bagherghardeshghari/frontend

# نصب وابستگی‌ها
npm install

# ساخت دیتابیس
npm run db:push

# (اختیاری) بارگذاری داده‌های نمونه
npm run db:seed

# اجرای سرور توسعه
npm run dev
```

برنامه روی **http://localhost:3000** اجرا می‌شود.

### اجرای سریع ویندوز

روی فایل `start.bat` در پوشه اصلی دابل‌کلیک کنید — به‌صورت خودکار وابستگی‌ها را نصب و سرور را اجرا می‌کند.

---

## 🗄️ دستورات دیتابیس

```bash
npm run db:migrate    # اجرای migration های جدید (حالت dev)
npm run db:push       # اعمال مستقیم تغییرات schema
npm run db:seed       # بارگذاری داده‌های نمونه
npm run db:studio     # باز کردن رابط گرافیکی Prisma Studio
npm run db:generate   # بازسازی Prisma Client
```

---

## 🔑 متغیرهای محیطی

فایل `.env` را در پوشه `frontend/` بسازید:

```env
# دیتابیس
DATABASE_URL="file:./dev.db"

# احراز هویت
JWT_SECRET="your-super-secret-jwt-key"

# پرداخت Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ایمیل (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your@email.com"
SMTP_PASS="your-app-password"

# آدرس سایت
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 👥 نقش‌های کاربری

| نقش | دسترسی‌ها |
|-----|-----------|
| `USER` | مرور تورها، رزرو، نظر، علاقه‌مندی، داشبورد شخصی |
| `GUIDE` | تمام دسترسی‌های USER + ایجاد و مدیریت تورهای خود |
| `ADMIN` | تمام دسترسی‌های GUIDE + پنل ادمین کامل |
| `SUPER_ADMIN` | دسترسی کامل به تمام بخش‌ها بدون محدودیت |

---

## ⚠️ نکات مهم

> **هشدار:** فایل‌های `dev.db` در ریپوزیتوری commit شده‌اند. بهتر است آن‌ها را به `.gitignore` اضافه کنید تا دیتابیس development روی GitHub نمانَد.

```gitignore
# اضافه کردن به frontend/.gitignore
*.db
*.db-journal
```

---

## 📄 لایسنس

این پروژه خصوصی است. تمام حقوق محفوظ است © ۱۴۰۴ باقر گردشگری.

</div>

---

---

# 🌍 VisitIran Tourism Platform

A complete, modern full-stack tourism booking platform for Iran — built with **Next.js 16**, **TypeScript**, **Prisma ORM**, and **SQLite/LibSQL**.

This project provides all the infrastructure needed for a professional tourism website: from browsing tours and online booking, to Stripe payments, a full admin panel, user dashboard, interactive maps, and support for 6 languages.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [API Routes](#-api-routes-1)
- [Database Models](#-database-models)
- [Multilingual Support](#-multilingual-support)
- [Getting Started](#-getting-started)
- [Database Commands](#%EF%B8%8F-database-commands)
- [Environment Variables](#-environment-variables)
- [User Roles](#-user-roles)
- [Important Notes](#%EF%B8%8F-important-notes)

---

## ✨ Features

### 🏕️ Tour Management
- Browse tours by province, type (Mountain, Forest, City, Village, Nature), and difficulty level
- Full tour detail pages with image galleries, itineraries, inclusions and exclusions
- Featured tours filter and Past Tours archive with complete reports
- Tour date management with capacity, special pricing, and notes

### 📅 Booking System
- Complete booking flow with guest info, number of guests, and special requests
- Optional add-on services: **Transport**, **Accommodation**, **Insurance**, **Visa**
- Coupon/discount code support with usage limits and minimum purchase
- Booking status tracking: PENDING → CONFIRMED → COMPLETED / CANCELLED

### 💳 Online Payment
- Full **Stripe Checkout** integration
- Stores `stripeSessionId` and `paymentIntentId` for transaction tracking
- Records exact timestamps for payment, confirmation, and completion

### 👤 Authentication & Users
- Sign up and login with **JWT** + **bcryptjs**
- User profile with avatar, country, phone, bio
- User dashboard with: **Bookings**, **Wishlist**, **Profile Editing**

### 🗺️ Interactive Map
- Display tour and attraction locations on a map with **Leaflet + React Leaflet**
- `latitude` and `longitude` stored for provinces, tours, and attractions

### 📝 Blog & Articles
- Article system with categories, tags, images, and author
- Publishing workflow with Featured support and scheduled publishing
- Article view counter

### ⭐ Reviews & Ratings
- Star ratings with pros, cons, and comments
- Admin review approval system (`isApproved`, `isVerified`)
- Helpful vote counter per review

### 🛠️ Full Admin Panel
- Statistics dashboard (bookings count, users, revenue, etc.)
- Full CRUD for: Tours, Tour Dates, Bookings, Users, Reviews, Articles, Past Tours
- Homepage slider management

### 📣 Communication
- Email newsletter system with subscription management
- Contact form with read/replied tracking
- Booking confirmation emails via **Nodemailer**

### 🔍 SEO
- `SEOHead.tsx` component for custom meta tags
- JSON-LD for structured data (Schema.org)
- Auto-generated `sitemap.ts` and `robots.ts`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| ORM | Prisma 7 |
| Database | SQLite (LibSQL / Turso-compatible) |
| Auth | JWT + bcryptjs |
| Payments | Stripe |
| Maps | Leaflet + React Leaflet |
| Email | Nodemailer |
| Linting | ESLint 9 |

---

## 📁 Project Structure

```
bagherghardeshghari/
├── frontend/
│   ├── prisma/
│   │   ├── schema.prisma         ← Full database model definitions
│   │   ├── seed.ts               ← Sample data seeder
│   │   └── migrations/           ← Migration history
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/           ← Login / Register pages
│   │   │   ├── (main)/           ← Public-facing pages
│   │   │   │   ├── about/        ← About Us
│   │   │   │   ├── blog/         ← Blog & Articles
│   │   │   │   ├── contact/      ← Contact Us
│   │   │   │   ├── dashboard/    ← User Dashboard
│   │   │   │   │   ├── bookings/ ← User Bookings
│   │   │   │   │   ├── profile/  ← Profile Editing
│   │   │   │   │   └── wishlist/ ← Saved Tours
│   │   │   │   ├── map/          ← Interactive Tour Map
│   │   │   │   └── tours/        ← Tour List & Detail
│   │   │   ├── admin/            ← Admin Panel
│   │   │   │   ├── tours/        ← Tour Management
│   │   │   │   ├── tour-dates/   ← Tour Date Management
│   │   │   │   ├── bookings/     ← Booking Management
│   │   │   │   ├── users/        ← User Management
│   │   │   │   ├── reviews/      ← Review Moderation
│   │   │   │   ├── articles/     ← Article Management
│   │   │   │   └── past-tours/   ← Past Tours Archive
│   │   │   ├── api/              ← Next.js API Routes
│   │   │   │   ├── auth/         ← Login, Register, Token
│   │   │   │   ├── tours/        ← Tour CRUD
│   │   │   │   ├── bookings/     ← Create & Manage Bookings
│   │   │   │   ├── payment/      ← Stripe Checkout
│   │   │   │   ├── reviews/      ← Review Submission & Management
│   │   │   │   ├── contact/      ← Contact Message Submission
│   │   │   │   ├── newsletter/   ← Newsletter Subscription
│   │   │   │   ├── upload/       ← File/Image Upload
│   │   │   │   └── admin/        ← Admin-only API endpoints
│   │   │   ├── booking/          ← Booking flow pages
│   │   │   ├── page.tsx          ← Homepage
│   │   │   ├── layout.tsx        ← Root Layout
│   │   │   ├── error.tsx         ← Error boundary
│   │   │   ├── not-found.tsx     ← 404 page
│   │   │   ├── loading.tsx       ← Loading state
│   │   │   ├── sitemap.ts        ← Auto-generated sitemap
│   │   │   └── robots.ts         ← Auto-generated robots.txt
│   │   ├── components/
│   │   │   ├── layout/           ← Header, Footer, Navbar
│   │   │   ├── map/              ← Map Components
│   │   │   ├── SEOHead.tsx       ← Custom meta tags
│   │   │   ├── json-ld.tsx       ← Schema.org JSON-LD
│   │   │   ├── LazyLoad.tsx      ← Lazy loading wrapper
│   │   │   └── Providers.tsx     ← React Context Providers
│   │   ├── context/              ← React Context
│   │   ├── lib/                  ← Prisma client, helpers
│   │   ├── messages/             ← i18n translation files
│   │   ├── types/                ← TypeScript type definitions
│   │   └── utils/                ← Utility functions
│   ├── public/                   ← Static assets
│   ├── next.config.ts
│   ├── tailwind.config
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   └── package.json
└── start.bat                     ← Windows quick-start script
```

---

## 🗺️ Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with slider and featured tours |
| `/tours` | All tours with filters and search |
| `/tours/[slug]` | Tour detail page |
| `/booking` | Booking flow |
| `/map` | Interactive tours & attractions map |
| `/blog` | Article listing |
| `/blog/[slug]` | Single article page |
| `/about` | About Us |
| `/contact` | Contact Us |
| `/dashboard` | User dashboard |
| `/dashboard/bookings` | User's bookings |
| `/dashboard/wishlist` | User's saved tours |
| `/dashboard/profile` | Edit profile |
| `/admin` | Admin panel (stats dashboard) |
| `/admin/tours` | Tour management |
| `/admin/tour-dates` | Tour date management |
| `/admin/bookings` | Booking management |
| `/admin/users` | User management |
| `/admin/reviews` | Review moderation |
| `/admin/articles` | Article management |
| `/admin/past-tours` | Past tours archive |

---

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login and receive JWT |
| `/api/tours` | GET | Get tour list |
| `/api/tours/[id]` | GET/PUT/DELETE | Single tour operations |
| `/api/bookings` | GET/POST | Create booking / list bookings |
| `/api/payment` | POST | Create Stripe Checkout Session |
| `/api/reviews` | GET/POST | Tour reviews |
| `/api/contact` | POST | Submit contact message |
| `/api/newsletter` | POST | Newsletter subscription |
| `/api/upload` | POST | File/image upload |
| `/api/admin/*` | * | Protected admin API endpoints |

---

## 📊 Database Models

The project includes **17 core models** in Prisma:

| Model | Description |
|-------|-------------|
| `User` | Users with roles and full profiles |
| `Tour` | Tours with multilingual fields, pricing, and itinerary |
| `TourDate` | Available tour dates with capacity management |
| `Province` | Iran's provinces with geolocation and multilingual names |
| `Attraction` | Tourist attractions linked to provinces and tours |
| `TourAttraction` | Many-to-Many relationship between Tour and Attraction |
| `Booking` | Reservations with full payment tracking and status |
| `PastTour` | Archive of completed tours with gallery and reports |
| `Media` | Photos and videos for tours |
| `Review` | User ratings and comments with approval workflow |
| `Article` | Blog articles with publishing workflow |
| `Wishlist` | User-saved tours |
| `Coupon` | Discount codes with usage limits |
| `Slider` | Homepage banner slides |
| `Newsletter` | Email newsletter subscriptions |
| `ContactMessage` | Contact form messages |
| `Translation` | Dynamic i18n key-value store |

---

## 🌐 Multilingual Support

All major content fields support translations in 6 languages:

| Code | Language |
|------|----------|
| `FA` | Persian (Farsi) |
| `EN` | English |
| `AR` | Arabic |
| `RU` | Russian |
| `ZH` | Chinese |
| `ES` | Spanish |

The `Translation` model also provides a dynamic key-value translation store in the database.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

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

Double-click `start.bat` in the root directory — it automatically installs dependencies if needed and launches the dev server.

---

## 🗄️ Database Commands

```bash
npm run db:migrate    # Run migrations (dev mode)
npm run db:push       # Push schema changes directly
npm run db:seed       # Seed with sample data
npm run db:studio     # Open Prisma Studio GUI
npm run db:generate   # Regenerate Prisma Client
```

---

## 🔑 Environment Variables

Create a `.env` file inside `frontend/`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Stripe Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your@email.com"
SMTP_PASS="your-app-password"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 👥 User Roles

| Role | Access |
|------|--------|
| `USER` | Browse tours, book, review, wishlist, personal dashboard |
| `GUIDE` | All USER access + create and manage own tours |
| `ADMIN` | All GUIDE access + full admin panel |
| `SUPER_ADMIN` | Full unrestricted access to everything |

---

## ⚠️ Important Notes

> **Warning:** `dev.db` files are currently committed to the repository. It's recommended to add them to `.gitignore` to prevent development databases from being stored on GitHub.

```gitignore
# Add to frontend/.gitignore
*.db
*.db-journal
```

---

## 📄 License

This project is private. All rights reserved © 2025 Bagher Ghardeshghari.
]]>
