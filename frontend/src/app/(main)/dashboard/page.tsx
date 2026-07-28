"use client";

import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t.dashboard.welcome}, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-600 mt-1">{t.home.popularToursDesc}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t.dashboard.myBookings, value: "3", color: "bg-emerald-50 text-emerald-600" },
          { label: t.dashboard.upcomingTrip, value: "1", color: "bg-blue-50 text-blue-600" },
          { label: t.dashboard.wishlist, value: "5", color: "bg-pink-50 text-pink-600" },
          { label: t.tourDetail.reviews, value: "2", color: "bg-yellow-50 text-yellow-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
            <p className="text-xl font-bold mb-2">{t.tours.pageTitle}</p>
            <p className="text-sm opacity-90 mb-4">2026 &bull; 3 {t.common.days}</p>
            <Link href="/dashboard/bookings" className="inline-flex items-center text-sm font-medium bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
              {t.common.viewDetails}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
