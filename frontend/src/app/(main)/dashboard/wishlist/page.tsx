"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { useAuth } from "@/context/AuthContext";

interface WishlistItem {
  id: string;
  tour: {
    id: string; title: string; titleEn: string; titleFa: string; slug: string;
    type: string; durationDays: number; price: number; averageRating: number;
    imageUrl: string | null; province: string;
  };
}

const typeLabels: Record<string, string> = { MOUNTAIN: "Mountaineering", FOREST: "Forest", CITY: "City Tour", VILLAGE: "Village", NATURE: "Nature" };

export default function WishlistPage() {
  const { t, locale, formatCurrency } = useI18n();
  const isFa = locale === "fa";
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch("/api/wishlist", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setWishlist(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const removeWishlist = async (tourId: string) => {
    if (!token) return;
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tourId }),
      });
      setWishlist((prev) => prev.filter((w) => w.tour.id !== tourId));
    } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.dashboard.wishlist}</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="h-48 relative overflow-hidden">
                {item.tour.imageUrl ? (
                  <img src={item.tour.imageUrl} alt={item.tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl font-bold opacity-30">{item.tour.titleEn?.charAt(0)}</div>
                )}
                <button onClick={() => removeWishlist(item.tour.id)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
                <span className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 text-xs font-medium text-gray-700 rounded">{typeLabels[item.tour.type] || item.tour.type}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{isFa ? item.tour.titleFa : item.tour.titleEn}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span>{item.tour.durationDays} {t.common.days}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                    {item.tour.averageRating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(item.tour.price)}</span>
                  <Link href={`/tours/${item.tour.slug}`} className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                    {t.common.viewDetails}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {wishlist.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.dashboard.noWishlist}</h3>
              <p className="text-gray-500 mb-4">{t.dashboard.saveTours}</p>
              <Link href="/tours" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                {t.dashboard.browseTours}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
