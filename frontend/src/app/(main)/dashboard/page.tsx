"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import Link from "next/link";

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  wishlistCount: number;
  reviewCount: number;
  nextBooking: {
    tourTitle: string;
    tourSlug: string;
    duration: number;
    startDate: string;
    endDate: string;
  } | null;
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const { t, locale } = useI18n();
  const isFa = locale === "fa";
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {});
  }, [token]);

  const statCards = [
    { label: t.dashboard.myBookings, value: stats?.totalBookings ?? "-", color: "bg-emerald-50 text-emerald-600", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: t.dashboard.upcomingTrip, value: stats?.upcomingBookings ?? "-", color: "bg-blue-50 text-blue-600", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: t.dashboard.wishlist, value: stats?.wishlistCount ?? "-", color: "bg-pink-50 text-pink-600", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { label: t.tourDetail.reviews, value: stats?.reviewCount ?? "-", color: "bg-yellow-50 text-yellow-600", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t.dashboard.welcome}, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-600 mt-1">{t.home.popularToursDesc}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.quickActions}</h2>
          <div className="space-y-3">
            <Link href="/tours" className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
              {t.dashboard.browseTours}
            </Link>
            <Link href="/dashboard/bookings" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              {t.dashboard.myBookings}
            </Link>
            <Link href="/map" className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              {t.common.map}
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.upcomingTrip}</h2>
          {stats?.nextBooking ? (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
              <p className="text-xl font-bold mb-2">{stats.nextBooking.tourTitle}</p>
              <p className="text-sm opacity-90 mb-4">
                {stats.nextBooking.startDate ? new Date(stats.nextBooking.startDate).toLocaleDateString() : ""} &bull; {stats.nextBooking.duration} {t.common.days}
              </p>
              <Link href={`/tours/${stats.nextBooking.tourSlug}`} className="inline-flex items-center text-sm font-medium bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                {t.common.viewDetails}
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-500 mb-3">{isFa ? "سفر آینده‌ای رزرو نشده" : "No upcoming trips"}</p>
              <Link href="/tours" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                {t.dashboard.browseTours}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
