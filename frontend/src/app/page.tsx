"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrganizationSchema } from "@/components/json-ld";
import { useI18n } from "@/context/I18nContext";

interface TourCard {
  id: string; slug: string; title: string; titleFa: string; titleEn: string;
  type: string; difficulty: string; durationDays: number; price: number;
  averageRating: number; totalReviews: number; province: string; imageUrl: string | null;
}

interface Testimonial {
  id: string; userName: string; comment: string; rating: number;
  tourTitle: string; country: string | null;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-100 text-green-700",
  MODERATE: "bg-yellow-100 text-yellow-700",
  HARD: "bg-orange-100 text-orange-700",
  VERY_HARD: "bg-red-100 text-red-700",
};

const difficultyLabels: Record<string, string> = {
  EASY: "easyLabel", MODERATE: "moderateLabel", HARD: "hardLabel", VERY_HARD: "veryHardLabel",
};

const typeLabelKeys: Record<string, string> = {
  MOUNTAIN: "mountaineeringLabel", FOREST: "forestLabel", CITY: "cityLabel", VILLAGE: "villageLabel", NATURE: "natureLabel",
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, locale } = useI18n();
  const isFa = locale === "fa";
  const [popularTours, setPopularTours] = useState<TourCard[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/tours")
      .then((r) => r.json())
      .then((d) => { if (d.success) setPopularTours(d.data.slice(0, 6)); })
      .catch(() => {});
    fetch("/api/reviews/featured")
      .then((r) => r.json())
      .then((d) => { if (d.success) setTestimonials(d.data); })
      .catch(() => {});
  }, []);

  const heroSlides = [
    {
      title: t.home.heroTitle1,
      subtitle: t.home.heroSubtitle1,
      gradient: "from-emerald-800/70 to-teal-900/70",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&auto=format&fit=crop",
      alt: "Mountains above clouds at sunset - Alborz Range",
    },
    {
      title: t.home.heroTitle2,
      subtitle: t.home.heroSubtitle2,
      gradient: "from-blue-800/70 to-indigo-900/70",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=85&auto=format&fit=crop",
      alt: "Green misty forest valley - Hyrcanian Forests",
    },
    {
      title: t.home.heroTitle3,
      subtitle: t.home.heroSubtitle3,
      gradient: "from-amber-800/70 to-orange-900/70",
      image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=85&auto=format&fit=crop",
      alt: "Snow-capped mountain peaks at sunset - Damavand",
    },
  ];

  const stats = [
    { value: "500+", label: t.home.stats.travelers },
    { value: "50+", label: t.home.stats.tours },
    { value: "31", label: t.home.stats.provinces },
    { value: "8+", label: t.home.stats.experience },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <OrganizationSchema />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
            >
              <img src={slide.image} alt={slide.alt} className="absolute inset-0 w-full h-full object-cover" loading={index === 0 ? "eager" : "lazy"} />
              <div className="absolute inset-0 bg-black/30" />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{slide.title}</h1>
                    <p className="text-xl text-white/90 mb-8">{slide.subtitle}</p>
                    <div className="flex flex-wrap gap-4">
                      <Link href="/tours" className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                        {t.home.exploreTours}
                      </Link>
                      <Link href="/about" className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                        {t.home.learnMore}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white w-8" : "bg-white/50"}`} />
            ))}
          </div>
        </section>

        {/* Quick Search */}
        <section className="relative -mt-16 z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.home.searchDestination}</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50">
                  <option>{t.home.allDestinations}</option>
                  <option>Mazandaran</option>
                  <option>Isfahan</option>
                  <option>Fars</option>
                  <option>Gilan</option>
                  <option>Yazd</option>
                  <option>Kerman</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.home.tourType}</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50">
                  <option>{t.home.allTypes}</option>
                  <option>{t.tours.mountaineering}</option>
                  <option>{t.tours.forest}</option>
                  <option>{t.tours.city}</option>
                  <option>{t.tours.village}</option>
                  <option>{t.tours.nature}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.home.duration}</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50">
                  <option>{t.home.anyDuration}</option>
                  <option>1-3 {t.common.days}</option>
                  <option>4-7 {t.common.days}</option>
                  <option>8-14 {t.common.days}</option>
                  <option>14+ {t.common.days}</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link href="/tours" className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-center">
                  {t.home.searchTours}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-bold text-emerald-600">{stat.value}</p>
                  <p className="text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Tours */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">{t.home.popularTours}</h2>
              <p className="text-gray-600 mt-2">{t.home.popularToursDesc}</p>
            </div>
            {popularTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTours.map((tour) => (
                  <Link key={tour.id} href={`/tours/${tour.slug}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-52 relative overflow-hidden">
                      {tour.imageUrl ? (
                        <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                      )}
                      <div className="absolute top-3 left-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[tour.difficulty]}`}>{t.tours[difficultyLabels[tour.difficulty] as keyof typeof t.tours]}</span></div>
                      <div className="absolute bottom-3 right-3 bg-white/90 px-2.5 py-1 rounded-full"><span className="text-sm font-bold text-emerald-600">${tour.price}</span></div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{t.tours[typeLabelKeys[tour.type] as keyof typeof t.tours]}</span>
                        <span className="text-xs text-gray-400">&bull;</span>
                        <span className="text-xs text-gray-500">{tour.durationDays} {t.common.days}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{isFa ? tour.titleFa : tour.titleEn}</h3>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-sm font-medium text-gray-900">{tour.averageRating}</span>
                        <span className="text-sm text-gray-400">({tour.totalReviews})</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4" />
              </div>
            )}
            <div className="text-center mt-10">
              <Link href="/tours" className="inline-flex items-center px-8 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-colors">
                {t.common.viewAll} {t.common.tours}
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.home.whyUs}</h2>
                <p className="text-gray-600 mb-6">{t.home.whyUsDesc}</p>
                <Link href="/about" className="inline-flex items-center mt-6 text-emerald-600 font-semibold hover:text-emerald-700">
                  {t.common.readMore}
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85&auto=format&fit=crop" alt="Islamic Architecture" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-100 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-100 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-emerald-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">{t.home.testimonials}</h2>
              <p className="text-emerald-100 mt-2">{t.home.testimonialsDesc}</p>
            </div>
            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">&quot;{testimonial.comment}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm">{testimonial.userName?.charAt(0) || "?"}</div>
                      <div>
                        <p className="font-medium text-gray-900">{testimonial.userName}</p>
                        <p className="text-sm text-gray-500">{testimonial.tourTitle} {testimonial.country ? `- ${testimonial.country}` : ""}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-emerald-100">{isFa ? "نظرات به زودی اضافه می‌شود" : "Reviews coming soon"}</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.home.newsletter}</h2>
            <p className="text-gray-600 mb-8">{t.home.newsletterDesc}</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder={t.home.emailPlaceholder} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
              <button type="submit" className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                {t.home.subscribe}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
