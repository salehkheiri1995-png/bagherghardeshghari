<div dir="rtl">

<div align="center">

# 🌍 باقر گردشگری — VisitIran

**پلتفرم کامل رزرو تور و گردشگری در ایران**

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-LibSQL-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

</div>

---

یک پلتفرم مدرن و کامل برای رزرو تور و گردشگری در ایران — ساخته‌شده با **Next.js 15.3.3**، **TypeScript**، **Prisma ORM** و **SQLite/LibSQL**.

این پروژه تمام زیرساخت‌های لازم برای یک سایت گردشگری حرفه‌ای را دارد: از مرور تورها و رزرو آنلاین، تا پرداخت Stripe، پنل ادمین کامل، داشبورد کاربری، نقشه تعاملی و پشتیبانی از ۶ زبان مختلف.

---

## 📋 فهرست مطالب

- [ویژگی‌ها](#-ویژگیها)
- [تکنولوژی‌ها](#️-تکنولوژیها)
- [ساختار پروژه](#-ساختار-پروژه)
- [صفحات و مسیرها](#️-صفحات-و-مسیرها)
- [API Routes](#-api-routes)
- [مدل‌های دیتابیس](#-مدلهای-دیتابیس)
- [پشتیبانی چندزبانه](#-پشتیبانی-چندزبانه)
- [نصب و راه‌اندازی](#-نصب-و-راهاندازی)
- [دستورات دیتابیس](#️-دستورات-دیتابیس)
- [متغیرهای محیطی](#-متغیرهای-محیطی)
- [نقش‌های کاربری](#-نقشهای-کاربری)
- [نکات فنی مهم](#-نکات-فنی-مهم)
- [مشارکت در توسعه](#-مشارکت-در-توسعه)
- [لایسنس](#-لایسنس)

---

## ✨ ویژگی‌ها

### 🏔️ مدیریت تور
- مرور تورها بر اساس استان، نوع (کوه، جنگل، شهر، روستا، طبیعت) و سطح دشواری
- صفحه جزئیات کامل تور با گالری تصاویر، برنامه سفر (itinerary)، امکانات شامل/غیرشامل
- فیلتر تورهای ویژه (Featured) و آرشیو تورهای گذشته با گزارش کامل
- مدیریت تاریخ‌های موجود هر تور با ظرفیت، قیمت ویژه و یادداشت
- status پیش‌فرض تورها `PUBLISHED` است — تورها بلافاصله روی سایت نمایش داده می‌شوند

### 📅 سیستم رزرو
- فرآیند رزرو کامل با اطلاعات مهمان، تعداد نفرات و درخواست‌های ویژه
- سرویس‌های اختیاری: **حمل‌ونقل**، **اقامت**، **بیمه**، **ویزا**
- اعمال کد تخفیف (Coupon) با محدودیت استفاده و حداقل خرید
- ردیابی وضعیت رزرو: `PENDING` ← `CONFIRMED` ← `COMPLETED` / `CANCELLED`

### 💳 پرداخت آنلاین
- یکپارچه‌سازی کامل با **Stripe Checkout**
- ذخیره `stripeSessionId` و `paymentIntentId` برای ردیابی تراکنش‌ها
- ثبت زمان‌های دقیق پرداخت، تأیید و تکمیل رزرو

### 🔐 احراز هویت و کاربران
- ثبت‌نام و ورود با **JWT** (کتابخانه `jose`) + **bcryptjs**
- سازگاری کامل با Edge Runtime (استفاده از `jose` به‌جای `jsonwebtoken`)
- خواندن توکن از `Authorization header` با fallback از `cookie`
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
- سیستم تأیید نظرات توسط ادمین (`isApproved`، `isVerified`)
- شمارنده مفید بودن نظر (`helpfulCount`)

### 🛠️ پنل ادمین کامل
- داشبورد آماری (تعداد رزروها، کاربران، درآمد و...)
- مدیریت کامل (CRUD): تورها، تاریخ‌های تور، رزروها، کاربران، نظرات، مقالات، تورهای گذشته
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
| فریمورک | Next.js 15.3.3 (App Router) |
| زبان | TypeScript 5 |
| استایل | Tailwind CSS 4 |
| ORM | Prisma 7 |
| دیتابیس | SQLite (LibSQL / سازگار با Turso) |
| احراز هویت | JWT با jose + bcryptjs |
| پرداخت | Stripe Checkout |
| نقشه | Leaflet + React Leaflet |
| ایمیل | Nodemailer |
| Linting | ESLint 9 |

---

## 📁 ساختار پروژه

```
bagherghardeshghari/
├── frontend/
│   ├── prisma/
│   │   ├── schema.prisma         ← تعریف کامل ۱۷ مدل دیتابیس
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
│   │   │   ├── admin/            ← پنل مدیریت (محافظت‌شده)
│   │   │   │   ├── tours/        ← مدیریت تورها
│   │   │   │   ├── tour-dates/   ← مدیریت تاریخ‌های تور
│   │   │   │   ├── bookings/     ← مدیریت رزروها
│   │   │   │   ├── users/        ← مدیریت کاربران
│   │   │   │   ├── reviews/      ← مدیریت نظرات
│   │   │   │   ├── articles/     ← مدیریت مقالات
│   │   │   │   └── past-tours/   ← آرشیو تورهای گذشته
│   │   │   ├── api/              ← Next.js API Routes
│   │   │   │   ├── auth/         ← register، login، set-cookie
│   │   │   │   ├── tours/        ← CRUD تورها
│   │   │   │   ├── bookings/     ← ایجاد و مدیریت رزرو
│   │   │   │   ├── payment/      ← Stripe Checkout Session
│   │   │   │   ├── reviews/      ← ثبت و مدیریت نظرات
│   │   │   │   ├── contact/      ← ارسال پیام تماس
│   │   │   │   ├── newsletter/   ← عضویت در خبرنامه
│   │   │   │   ├── upload/       ← آپلود فایل/تصویر
│   │   │   │   └── admin/        ← API های اختصاصی ادمین
│   │   │   ├── booking/          ← فرآیند رزرو + صفحه success
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
│   │   │   ├── tour/             ← TourDetailClient و سایر
│   │   │   ├── SEOHead.tsx       ← تگ‌های meta سفارشی
│   │   │   ├── json-ld.tsx       ← Schema.org JSON-LD
│   │   │   ├── LazyLoad.tsx      ← بارگذاری تنبل
│   │   │   └── Providers.tsx     ← React Context Providers
│   │   ├── context/
│   │   │   ├── AuthContext.tsx   ← مدیریت احراز هویت
│   │   │   └── I18nContext.tsx   ← مدیریت چندزبانه
│   │   ├── lib/                  ← Prisma client، هلپرها
│   │   ├── messages/             ← فایل‌های ترجمه (i18n)
│   │   ├── types/                ← تعاریف TypeScript
│   │   ├── utils/
│   │   │   └── helpers.ts        ← توابع کمکی
│   │   └── proxy.ts              ← پروکسی درخواست‌ها
│   ├── public/                   ← فایل‌های استاتیک
│   ├── next.config.ts
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
| `/booking` | فرآیند رزرو تور (نیاز به لاگین) |
| `/booking/success` | صفحه تأیید رزرو موفق |
| `/map` | نقشه تعاملی تورها و جاذبه‌ها |
| `/blog` | لیست مقالات |
| `/blog/[slug]` | صفحه مقاله |
| `/about` | درباره ما |
| `/contact` | تماس با ما |
| `/login` | ورود کاربر |
| `/register` | ثبت‌نام کاربر |
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

| Endpoint | متد | توضیح | احراز هویت |
|----------|-----|-------|------------|
| `/api/auth/register` | POST | ثبت‌نام کاربر جدید | ❌ |
| `/api/auth/login` | POST | ورود و دریافت JWT | ❌ |
| `/api/auth/set-cookie` | POST | ذخیره توکن در cookie | ❌ |
| `/api/tours` | GET | دریافت لیست تورها | ❌ |
| `/api/tours` | POST | ایجاد تور جدید | ✅ ADMIN |
| `/api/tours/[slug]` | GET | جزئیات تور | ❌ |
| `/api/tours/[slug]` | PUT/DELETE | ویرایش/حذف تور | ✅ ADMIN |
| `/api/bookings` | GET | لیست رزروها | ✅ |
| `/api/bookings` | POST | ایجاد رزرو جدید | ✅ |
| `/api/payment` | POST | Stripe Checkout Session | ✅ |
| `/api/reviews` | GET/POST | نظرات تور | ✅ |
| `/api/contact` | POST | ارسال پیام تماس | ❌ |
| `/api/newsletter` | POST | عضویت در خبرنامه | ❌ |
| `/api/upload` | POST | آپلود تصویر/فایل | ✅ |
| `/api/admin/*` | * | API های اختصاصی ادمین | ✅ ADMIN |

---

## 📊 مدل‌های دیتابیس

پروژه شامل **۱۷ مدل** اصلی در Prisma است:

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

`I18nContext` مدیریت تغییر زبان و لود ترجمه‌های داینامیک را بر عهده دارد. مدل `Translation` نیز برای ذخیره ترجمه‌های پویا در دیتابیس وجود دارد.

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

# ساخت فایل محیطی
cp .env.example .env
# فایل .env را با مقادیر واقعی پر کنید

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
npm run db:push       # اعمال مستقیم تغییرات schema (بدون migration)
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

# احراز هویت (jose)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

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

## ⚙️ نکات فنی مهم

### احراز هویت با jose
این پروژه از کتابخانه `jose` به‌جای `jsonwebtoken` استفاده می‌کند تا با **Next.js Edge Runtime** سازگار باشد:

```ts
// ✅ درست — سازگار با Edge Runtime
import { SignJWT, jwtVerify } from 'jose'

// ❌ اشتباه — فقط در Node.js کار می‌کند
import jwt from 'jsonwebtoken'
```

توکن ابتدا از `Authorization: Bearer <token>` خوانده می‌شود و در صورت نبود، از `cookie` به عنوان fallback استفاده می‌شود.

### Middleware
مسیر `/booking` در `matcher` تعریف شده تا کاربران بدون لاگین نتوانند رزرو کنند.

### دیتابیس
فایل‌های `dev.db` نباید در ریپوزیتوری commit شوند. حتماً به `.gitignore` اضافه کنید:

```gitignore
# frontend/.gitignore
*.db
*.db-journal
```

---

## 🤝 مشارکت در توسعه

برای مشارکت در توسعه این پروژه مراحل زیر را دنبال کنید:

1. ریپوزیتوری را **Fork** کنید
2. یک branch جدید بسازید: `git checkout -b feature/my-feature`
3. تغییرات خود را commit کنید: `git commit -m 'feat: add my feature'`
4. branch را push کنید: `git push origin feature/my-feature`
5. یک **Pull Request** باز کنید

> لطفاً قبل از ارسال PR، مطمئن شوید کدتان از ESLint بدون خطا رد می‌شود:
> ```bash
> npm run lint
> ```

---

## 📄 لایسنس

این پروژه خصوصی است. تمام حقوق محفوظ است © ۱۴۰۴ باقر گردشگری.

</div>
