"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEOHead";
import { TourSchema } from "@/components/json-ld";
import { useI18n } from "@/context/I18nContext";
import { useAuth } from "@/context/AuthContext";
import TourMap from "@/components/map/TourMap";

interface ItineraryDay {
  day: number; title: string; titleFa: string; description: string; descriptionFa: string;
  activities: string[]; activitiesFa: string[]; accommodation?: string; accommodationFa?: string;
}

interface TourDate {
  id: string; startDate: string; endDate: string; availableSpots: number; maxCapacity: number; specialPrice: number | null; notes: string | null;
}

interface TourData {
  id: string; title: string; titleEn: string; titleFa: string; slug: string;
  type: string; difficulty: string; durationDays: number; price: number; priceToman: number | null; discountPrice: number | null;
  currency: string; capacity: number; location: string; province: string; city: string | null;
  description: string; descriptionEn: string; descriptionFa: string;
  includes: string[]; includesFa: string[]; excludes: string[]; excludesFa: string[];
  requirements: string[]; requirementsFa: string[]; itinerary: ItineraryDay[];
  averageRating: number; totalReviews: number; totalBookings: number;
  guideLang: string; latitude: number | null; longitude: number | null;
  isFeatured: boolean; tourDates: TourDate[];
  imageUrl: string | null; galleryImages: string[];
}

interface PastTour {
  id: string; title: string; titleFa: string | null;
  description: string; descriptionFa: string | null;
  date: string; guideName: string; guideNameFa: string | null;
  location: string; locationFa: string | null;
  photos: number; imageUrl: string | null;
  galleryImages: string[]; highlights: string[]; highlightsFa: string | null;
  participants: number | null; rating: number | null;
  weather: string | null; weatherFa: string | null;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-100 text-green-700",
  MODERATE: "bg-yellow-100 text-yellow-700",
  HARD: "bg-orange-100 text-orange-700",
  VERY_HARD: "bg-red-100 text-red-700",
};

export default function TourDetailClient() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale, formatCurrency } = useI18n();
  const isFa = locale === "fa";
  const { user, token } = useAuth();
  const router = useRouter();

  const [tour, setTour] = useState<TourData | null>(null);
  const [pastTours, setPastTours] = useState<PastTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDateId, setSelectedDateId] = useState("");
  const [guests, setGuests] = useState(1);
  const [activeTab, setActiveTab] = useState<"itinerary" | "includes" | "reviews" | "archive">("itinerary");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingForm, setBookingForm] = useState({ firstName: "", lastName: "", email: "", phone: "", country: "" });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/tours/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          setTour({
            ...d,
            itinerary: d.itinerary || [],
            itineraryFa: d.itineraryFa || [],
            includes: d.includes || [],
            includesFa: d.includesFa || [],
            excludes: d.excludes || [],
            excludesFa: d.excludesFa || [],
            requirements: d.requirements || [],
            requirementsFa: d.requirementsFa || [],
            tourDates: d.tourDates || [],
            galleryImages: d.galleryImages || [],
          });
          if (data.data.tourDates?.length > 0) {
            setSelectedDateId(data.data.tourDates[0].id);
          }
          const ptRes = await fetch(`/api/tours/${slug}/past-tours`);
          const ptData = await ptRes.json();
          if (ptData.success) setPastTours(ptData.data);
        } else {
          setError(isFa ? "تور یافت نشد" : "Tour not found");
        }
      } catch {
        setError(isFa ? "خطا در بارگذاری" : "Error loading tour");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug, isFa]);

  const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async () => {
    setBookingError("");
    if (!user || !token) {
      setBookingError(isFa ? "لطفا ابتدا وارد شوید" : "Please sign in first");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }
    if (!bookingForm.firstName || !bookingForm.lastName || !bookingForm.email) {
      setBookingError(isFa ? "لطفا نام و ایمیل را وارد کنید" : "Please fill in name and email");
      return;
    }
    setBookingLoading(true);
    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tourId: tour!.id,
          tourDateId: selectedDateId || undefined,
          numberOfGuests: guests,
          guestName: `${bookingForm.firstName} ${bookingForm.lastName}`,
          guestEmail: bookingForm.email,
          guestPhone: bookingForm.phone,
          guestCountry: bookingForm.country,
        }),
      });
      const bookingData = await bookingRes.json();
      if (!bookingData.success) {
        setBookingError(bookingData.error || "Booking failed");
        setBookingLoading(false);
        return;
      }
      const paymentRes = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId: bookingData.data.id }),
      });
      const paymentData = await paymentRes.json();
      if (paymentData.success && paymentData.data.url) {
        window.location.href = paymentData.data.url;
      } else {
        setBookingError(paymentData.error || "Payment session failed");
        setBookingLoading(false);
      }
    } catch {
      setBookingError(isFa ? "خطا در پردازش" : "An error occurred");
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
            <p className="text-gray-500">{isFa ? "در حال بارگذاری..." : "Loading..."}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">{error || (isFa ? "تور یافت نشد" : "Tour not found")}</p>
            <Link href="/tours" className="text-emerald-600 font-medium hover:text-emerald-700">{isFa ? "بازگشت به تورها" : "Back to Tours"}</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const safeTourDates = Array.isArray(tour.tourDates) ? tour.tourDates : [];
  const safeItinerary = Array.isArray(tour.itinerary) ? tour.itinerary : [];
  const safeIncludes = Array.isArray(tour.includes) ? tour.includes : [];
  const safeIncludesFa = Array.isArray(tour.includesFa) ? tour.includesFa : [];
  const safeExcludes = Array.isArray(tour.excludes) ? tour.excludes : [];
  const safeExcludesFa = Array.isArray(tour.excludesFa) ? tour.excludesFa : [];
  const safeRequirements = Array.isArray(tour.requirements) ? tour.requirements : [];
  const safeRequirementsFa = Array.isArray(tour.requirementsFa) ? tour.requirementsFa : [];

  const selectedDate = safeTourDates.find((d) => d.id === selectedDateId);
  const datePrice = selectedDate?.specialPrice || tour.price;
  const totalPrice = datePrice * guests;

  const difficultyLabel = tour.difficulty === "VERY_HARD" ? t.tours.veryHardLabel : tour.difficulty === "MODERATE" ? t.tours.moderateLabel : tour.difficulty === "HARD" ? t.tours.hardLabel : t.tours.easyLabel;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={isFa ? tour.titleFa : tour.title} description={isFa ? tour.descriptionFa : tour.descriptionEn} />
      <TourSchema name={tour.title} description={tour.descriptionEn} price={tour.price} rating={tour.averageRating} reviewCount={tour.totalReviews} duration={`${tour.durationDays} days`} url={`https://visitiran.com/tours/${slug}`} />
      <Header />
      <main className="flex-1">
        <section className="relative h-[400px] md:h-[500px]">
          {tour.imageUrl ? (
            <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600" />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[tour.difficulty]}`}>{difficultyLabel}</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">{t.tours[`type${tour.type}` as keyof typeof t.tours] || tour.type}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{isFa ? tour.titleFa : tour.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {tour.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {tour.durationDays} {t.common.days}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {tour.averageRating} ({tour.totalReviews} {t.common.reviews})
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.tourDetail.aboutTour}</h2>
                <p className="text-gray-600 leading-relaxed mb-3">{isFa ? tour.descriptionFa : tour.descriptionEn}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-100">
                  <div className="flex overflow-x-auto">
                    {(["itinerary", "includes", "reviews", "archive"] as const).map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        {tab === "itinerary" ? t.tourDetail.itinerary : tab === "includes" ? t.tourDetail.whatsIncluded : tab === "reviews" ? t.tourDetail.reviews : t.tourDetail.pastTours}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  {activeTab === "itinerary" && (
                    <div className="space-y-6">
                      {safeItinerary.length > 0 ? safeItinerary.map((day) => (
                        <div key={day.day} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">{day.day}</div>
                            <div className="w-0.5 flex-1 bg-emerald-200 mt-2" />
                          </div>
                          <div className="pb-6 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t.tourDetail.dayPrefix} {day.day}: {isFa ? day.titleFa : day.title}</h3>
                            <p className="text-gray-600 mb-2">{isFa ? day.descriptionFa : day.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(isFa ? (day.activitiesFa || []) : (day.activities || [])).map((activity, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{activity}</span>
                              ))}
                            </div>
                            {day.accommodation && day.accommodation !== "-" && (
                              <p className="mt-2 text-sm text-gray-500">{t.tourDetail.stayLabel}: {isFa ? day.accommodationFa : day.accommodation}</p>
                            )}
                          </div>
                        </div>
                      )) : (
                        <p className="text-gray-400 text-center py-8">{isFa ? "برنامه سفر هنوز اضافه نشده" : "Itinerary coming soon"}</p>
                      )}
                    </div>
                  )}
                  {activeTab === "includes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.tourDetail.whatsIncluded}</h3>
                        <ul className="space-y-3">
                          {safeIncludes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600">
                              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              <div><span>{item}</span><span className="block text-sm text-gray-400" dir="rtl">{safeIncludesFa[i]}</span></div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.tourDetail.whatsNotIncluded}</h3>
                        <ul className="space-y-3">
                          {safeExcludes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600">
                              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              <div><span>{item}</span><span className="block text-sm text-gray-400" dir="rtl">{safeExcludesFa[i]}</span></div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {activeTab === "reviews" && (
                    <p className="text-gray-400 text-center py-8">{isFa ? "نظرات هنوز ثبت نشده" : "No reviews yet"}</p>
                  )}
                  {activeTab === "archive" && (
                    <div className="space-y-6">
                      {pastTours.length > 0 ? pastTours.map((pt) => (
                        <div key={pt.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                          {pt.imageUrl && (<div className="h-48 overflow-hidden"><img src={pt.imageUrl} alt={pt.title} className="w-full h-full object-cover" /></div>)}
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{isFa ? pt.titleFa || pt.title : pt.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{new Date(pt.date).toLocaleDateString(isFa ? "fa-IR" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                            <p className="text-gray-600">{isFa ? pt.descriptionFa || pt.description : pt.description}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-gray-400 text-center py-8">{isFa ? "آرشیو سفرهای قبلی هنوز اضافه نشده" : "No past tours archived yet"}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {safeRequirements.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t.tourDetail.requirements}</h2>
                  <ul className="space-y-2">
                    {safeRequirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>{isFa ? safeRequirementsFa[i] : req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.tourDetail.tourLocation}</h2>
                {tour.latitude && tour.longitude ? (
                  <TourMap latitude={tour.latitude} longitude={tour.longitude} tourName={isFa ? tour.titleFa : tour.titleEn} location={tour.location} height="350px" />
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-sm text-gray-400">{isFa ? "موقعیت روی نقشه تنظیم نشده" : "Map location not set"}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-emerald-600">{formatCurrency(totalPrice, undefined, tour.priceToman ? tour.priceToman * guests : null)}</span>
                    <span className="text-gray-500">{t.tourDetail.total}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{formatCurrency(datePrice, undefined, tour.priceToman)} {t.common.perPerson} &bull; {guests} {t.common.guests}</p>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.tourDetail.selectDate}</label>
                      {safeTourDates.length > 0 ? (
                        <select value={selectedDateId} onChange={(e) => setSelectedDateId(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm">
                          {safeTourDates.map((date) => (
                            <option key={date.id} value={date.id}>
                              {new Date(date.startDate).toLocaleDateString()} - {new Date(date.endDate).toLocaleDateString()} ({date.availableSpots} {t.common.spotsLeft}){date.specialPrice ? ` - ${formatCurrency(date.specialPrice, undefined, tour.priceToman)}` : ""}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-gray-400 py-3">{isFa ? "تاریخی موجود نیست" : "No dates available"}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.tourDetail.guests}</label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">-</button>
                        <span className="text-lg font-semibold w-8 text-center">{guests}</span>
                        <button onClick={() => setGuests(Math.min(tour.capacity, guests + 1))} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">+</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowBookingModal(true)} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">{t.tourDetail.bookNow}</button>
                  <p className="text-xs text-center text-gray-400 mt-3">{t.tourDetail.freeCancellation}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">{t.tourDetail.tourInfo}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.duration}</span><span className="font-medium text-gray-900">{tour.durationDays} {t.common.days}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.maxGroup}</span><span className="font-medium text-gray-900">{tour.capacity}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.difficulty}</span><span className="font-medium text-gray-900">{difficultyLabel}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.language}</span><span className="font-medium text-gray-900">{tour.guideLang === "EN" ? t.tours.langEN : t.tours.langFA}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.province}</span><span className="font-medium text-gray-900">{tour.province}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showBookingModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => { setShowBookingModal(false); setBookingError(""); }}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t.booking.title}</h2>
                <button onClick={() => { setShowBookingModal(false); setBookingError(""); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-emerald-800 font-medium">{isFa ? tour.titleFa : tour.title}</p>
                  <p className="text-sm text-emerald-600 mt-1">{selectedDate ? `${new Date(selectedDate.startDate).toLocaleDateString()} - ${new Date(selectedDate.endDate).toLocaleDateString()}` : ""} &bull; {guests} {t.common.guests}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.firstName} *</label><input type="text" name="firstName" value={bookingForm.firstName} onChange={handleBookingFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.lastName} *</label><input type="text" name="lastName" value={bookingForm.lastName} onChange={handleBookingFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.email} *</label><input type="email" name="email" value={bookingForm.email} onChange={handleBookingFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.phone}</label><input type="tel" name="phone" value={bookingForm.phone} onChange={handleBookingFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.country}</label><input type="text" name="country" value={bookingForm.country} onChange={handleBookingFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" /></div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">{t.booking.tourPrice} ({guests}x)</span><span className="font-medium">{formatCurrency(datePrice * guests, undefined, tour.priceToman ? tour.priceToman * guests : null)}</span></div>
                  <div className="flex justify-between font-semibold text-lg"><span>{t.common.total}</span><span className="text-emerald-600">{formatCurrency(totalPrice, undefined, tour.priceToman ? tour.priceToman * guests : null)}</span></div>
                </div>
                {bookingError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{bookingError}</p>}
                <button onClick={handleProceedToPayment} disabled={bookingLoading} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {bookingLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />{isFa ? "در حال پردازش..." : "Processing..."}</>) : t.booking.proceedToPayment}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
