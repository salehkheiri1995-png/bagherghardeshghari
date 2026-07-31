// VisitIran - TypeScript Types

// ==========================================
// ENUMS
// ==========================================
export type UserRole = "USER" | "GUIDE" | "ADMIN" | "SUPER_ADMIN";
export type TourType = "MOUNTAIN" | "FOREST" | "CITY" | "VILLAGE" | "NATURE";
export type Difficulty = "EASY" | "MODERATE" | "HARD" | "VERY_HARD";
export type TourStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";
export type BookingStatus =
  | "PENDING"
  | "PAID"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";
export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";
export type AttractionType =
  | "HISTORICAL"
  | "NATURAL"
  | "RELIGIOUS"
  | "RECREATIONAL";
export type ArticleCategory =
  | "TRAVEL_GUIDE"
  | "DESTINATION"
  | "FOOD"
  | "CULTURE"
  | "NEWS"
  | "TIPS";
export type DiscountType = "PERCENTAGE" | "FIXED";
export type Currency = "USD" | "EUR" | "IRR" | "JPY";
export type Locale = "fa" | "en" | "ar" | "ru" | "zh" | "es";

// ==========================================
// MODELS
// ==========================================
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  country?: string;
  phone?: string;
  bio?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Province {
  id: string;
  name: string;
  nameEn: string;
  nameAr?: string;
  nameRu?: string;
  nameZh?: string;
  nameEs?: string;
  description?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tour {
  id: string;
  title: string;
  titleEn: string;
  titleAr?: string;
  titleRu?: string;
  titleZh?: string;
  titleEs?: string;
  slug: string;
  description: string;
  descriptionEn: string;
  descriptionAr?: string;
  descriptionRu?: string;
  descriptionZh?: string;
  descriptionEs?: string;
  type: TourType;
  difficulty: Difficulty;
  durationDays: number;
  price: number;
  discountPrice?: number;
  currency: Currency;
  capacity: number;
  minAge: number;
  maxGroupSize: number;
  location: string;
  provinceRef?: { name: string; nameEn: string } | null;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  includes: string; // JSON
  excludes: string; // JSON
  requirements: string; // JSON
  itinerary: string; // JSON
  status: TourStatus;
  isFeatured: boolean;
  isArchived: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  views: number;
  guideLang: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  provinceId?: string;
  provinceRef?: Province;
  createdBy?: string;
  creator?: User;
  tourDates?: TourDate[];
  media?: Media[];
  reviews?: Review[];
  tourAttrs?: TourAttraction[];
}

export interface TourDate {
  id: string;
  tourId: string;
  tour?: Tour;
  startDate: Date;
  endDate: Date;
  availableSpots: number;
  maxCapacity: number;
  isActive: boolean;
  specialPrice?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attraction {
  id: string;
  name: string;
  nameEn: string;
  nameAr?: string;
  nameRu?: string;
  nameZh?: string;
  nameEs?: string;
  description: string;
  descriptionEn?: string;
  type: AttractionType;
  image?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
  provinceId: string;
  province?: Province;
}

export interface TourAttraction {
  id: string;
  tourId: string;
  attractionId: string;
  tour?: Tour;
  attraction?: Attraction;
  dayNumber?: number;
}

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  tourId: string;
  tour?: Tour;
  tourDateId?: string;
  tourDate?: TourDate;
  numberOfGuests: number;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  currency: Currency;
  status: BookingStatus;
  paymentMethod?: string;
  paymentId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestCountry?: string;
  guestNotes?: string;
  specialRequests?: string;
  transportService: boolean;
  accommodationService: boolean;
  insuranceService: boolean;
  visaService: boolean;
  couponCode?: string;
  bookedAt: Date;
  paidAt?: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  id: string;
  tourId?: string;
  tour?: Tour;
  type: MediaType;
  url: string;
  thumbnail?: string;
  caption?: string;
  captionEn?: string;
  altText?: string;
  isArchive: boolean;
  location?: string;
  dateTaken?: Date;
  guideName?: string;
  tripNotes?: string;
  uploadedById?: string;
  uploader?: User;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  user?: User;
  tourId: string;
  tour?: Tour;
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  travelDate?: Date;
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  excerptEn?: string;
  category: ArticleCategory;
  tags: string; // JSON
  image?: string;
  authorId?: string;
  author?: User;
  views: number;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  tourId: string;
  user?: User;
  tour?: Tour;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Newsletter {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: Date;
}

export interface Slider {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  image: string;
  link?: string;
  buttonText?: string;
  buttonTextEn?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Translation {
  id: string;
  key: string;
  locale: Locale;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// API TYPES
// ==========================================
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TourFilters extends PaginationParams {
  type?: TourType;
  difficulty?: Difficulty;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  search?: string;
  isFeatured?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface BookingCreateInput {
  tourId: string;
  tourDateId?: string;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestCountry?: string;
  specialRequests?: string;
  transportService?: boolean;
  accommodationService?: boolean;
  insuranceService?: boolean;
  visaService?: boolean;
  couponCode?: string;
}

export interface ReviewCreateInput {
  tourId: string;
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  travelDate?: string;
}

export interface UserUpdateInput {
  name?: string;
  avatar?: string;
  country?: string;
  phone?: string;
  bio?: string;
}

export interface TourCreateInput {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: TourType;
  difficulty?: Difficulty;
  durationDays: number;
  price: number;
  discountPrice?: number;
  currency?: Currency;
  capacity: number;
  minAge?: number;
  maxGroupSize?: number;
  location: string;
  provinceRef?: { name: string; nameEn: string } | null;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  includes?: string[];
  excludes?: string[];
  requirements?: string[];
  itinerary?: ItineraryDay[];
  guideLang?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals?: string[];
}
