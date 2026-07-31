"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEOHead";
import { useI18n } from "@/context/I18nContext";

interface TourItem {
  id: string;
  title: string;
  titleEn: string;
  titleFa: string;
  slug: string;
  type: string;
  provinceRef: { name: string; nameEn: string } | null;
  city: string | null;
  difficulty: string;
  durationDays: number;
  price: number;
  priceToman: number | null;
  capacity: number;
  location: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  guideLang: string;
  descriptionEn: string;
  imageUrl: string | null;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-100 text-green-700",
  MODERATE: "bg-yellow-100 text-yellow-700",
  HARD: "bg-orange-100 text-orange-700",
  VERY_HARD: "bg-red-100 text-red-700",
};

const difficultyLabels: Record<string, string> = {
  EASY: "easyLabel",
  MODERATE: "moderateLabel",
  HARD: "hardLabel",
  VERY_HARD: "veryHardLabel",
};

const typeLabelKeys: Record<string, string> = {
  MOUNTAIN: "mountaineeringLabel",
  FOREST: "forestLabel",
  CITY: "cityLabel",
  VILLAGE: "villageLabel",
  NATURE: "natureLabel",
};

export default function ToursPage() {
  const { t, locale, formatCurrency } = useI18n();
  const isFa = locale === "fa";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({ type: "", province: "", difficulty: "", duration: "", search: "" });
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.type) params.set("type", filters.type);
        if (filters.province) params.set("province", filters.province);
        if (filters.difficulty) params.set("difficulty", filters.difficulty);
        if (filters.duration) params.set("duration", filters.duration);
        if (filters.search) params.set("search", filters.search);
        const res = await fetch(`/api/tours?${params.toString()}`);
        const data = await res.json();
        if (data.success) setTours(data.data);
      } catch {
        setTours([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [filters]);

  const tourTypes = [
    { value: "", label: t.tours.allTypes },
    { value: "MOUNTAIN", label: t.tours.mountaineering },
    { value: "FOREST", label: t.tours.forest },
    { value: "CITY", label: t.tours.city },
    { value: "VILLAGE", label: t.tours.village },
    { value: "NATURE", label: t.tours.nature },
  ];

  const provinces = [
    { value: "", label: t.tours.allProvinces },
    { value: "Mazandaran", label: "Mazandaran" },
    { value: "Isfahan", label: "Isfahan" },
    { value: "Fars", label: "Fars (Shiraz)" },
    { value: "Gilan", label: "Gilan" },
    { value: "Yazd", label: "Yazd" },
    { value: "Kerman", label: "Kerman" },
  ];

  const difficulties = [
    { value: "", label: t.tours.allLevels },
    { value: "EASY", label: t.tours.easy },
    { value: "MODERATE", label: t.tours.moderate },
    { value: "HARD", label: t.tours.hard },
    { value: "VERY_HARD", label: t.tours.veryHard },
  ];

  const durations = [
    { value: "", label: t.home.anyDuration },
    { value: "1-3", label: `1-3 ${t.common.days}` },
    { value: "4-7", label: `4-7 ${t.common.days}` },
    { value: "8-14", label: `8-14 ${t.common.days}` },
    { value: "15-30", label: `15+ ${t.common.days}` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={t.tours.pageTitle} description={t.tours.pageDesc} />
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.tours.pageTitle}</h1>
            <p className="text-emerald-100">{t.tours.pageDesc}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <input type="text" placeholder={t.common.search} value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
              <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                {tourTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select value={filters.province} onChange={(e) => setFilters({ ...filters, province: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                {provinces.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                {difficulties.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              <select value={filters.duration} onChange={(e) => setFilters({ ...filters, duration: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                {durations.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">{loading ? "..." : `${tours.length} ${t.tours.toursFound}`}</p>
            <div className="flex gap-2">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4" />
              <p className="text-gray-500">{isFa ? "در حال بارگذاری..." : "Loading tours..."}</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <Link key={tour.id} href={`/tours/${tour.slug}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-52 relative overflow-hidden">
                    {tour.imageUrl ? (
                      <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                    )}
                    <div className="absolute top-3 left-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[tour.difficulty]}`}>{t.tours[difficultyLabels[tour.difficulty] as keyof typeof t.tours]}</span></div>
                    <div className="absolute bottom-3 right-3 bg-white/90 px-2.5 py-1 rounded-full"><span className="text-sm font-bold text-emerald-600">{formatCurrency(tour.price, undefined, tour.priceToman)}</span></div>
                    {tour.isFeatured && <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-medium">{t.tours.featured}</div>}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{t.tours[typeLabelKeys[tour.type] as keyof typeof t.tours]}</span>
                      <span className="text-xs text-gray-400">&bull;</span>
                      <span className="text-xs text-gray-500">{tour.durationDays} {t.common.days}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{isFa ? tour.titleFa : tour.title}</h3>
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
            <div className="space-y-4">
              {tours.map((tour) => (
                <Link key={tour.id} href={`/tours/${tour.slug}`} className="group flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="w-64 h-48 relative flex-shrink-0 overflow-hidden">
                    {tour.imageUrl ? (
                      <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                    )}
                    <div className="absolute top-3 left-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[tour.difficulty]}`}>{t.tours[difficultyLabels[tour.difficulty] as keyof typeof t.tours]}</span></div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{t.tours[typeLabelKeys[tour.type] as keyof typeof t.tours]}</span>
                        <span className="text-xs text-gray-400">&bull;</span>
                        <span className="text-xs text-gray-500">{tour.durationDays} {t.common.days}</span>
                        <span className="text-xs text-gray-400">&bull;</span>
                        <span className="text-xs text-gray-500">{tour.provinceRef?.nameEn || tour.provinceRef?.name}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{isFa ? tour.titleFa : tour.title}</h3>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-sm font-medium text-gray-900">{tour.averageRating}</span>
                        <span className="text-sm text-gray-400">({tour.totalReviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-bold text-emerald-600">{formatCurrency(tour.price, undefined, tour.priceToman)}</span>
                      <span className="text-sm text-gray-500">{t.common.perPerson}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && tours.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t.tours.noTours}</p>
              <button onClick={() => setFilters({ type: "", province: "", difficulty: "", duration: "", search: "" })} className="mt-4 text-emerald-600 font-medium hover:text-emerald-700">
                {t.tours.clearFilters}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
