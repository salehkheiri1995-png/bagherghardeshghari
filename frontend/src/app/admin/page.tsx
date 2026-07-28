"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

interface StatsData {
  totalUsers: number;
  totalTours: number;
  totalBookings: number;
  totalRevenue: number;
}

interface BookingItem {
  id: string;
  createdAt: string;
  finalPrice: number;
  status: string;
  user: { name: string };
  tour: { titleEn: string; slug: string };
}

interface PopularTour {
  titleEn: string;
  totalBookings: number;
  price: number;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default function AdminDashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState<StatsData>({ totalUsers: 0, totalTours: 0, totalBookings: 0, totalRevenue: 0 });
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [popularTours, setPopularTours] = useState<PopularTour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data.stats);
          setRecentBookings(data.data.recentBookings || []);
          setPopularTours(data.data.popularTours || []);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { labelKey: "totalUsers", value: stats.totalUsers.toLocaleString(), icon: "M12 4.354a4 4 0 110 7.292 4 4 0 010-7.292zM15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { labelKey: "totalTours", value: stats.totalTours.toString(), icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
    { labelKey: "totalBookings", value: stats.totalBookings.toString(), icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { labelKey: "revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.dashboard}</h1>
        <p className="text-gray-500 mt-1">{t.common.welcomeBack}! {t.common.whatsHappening}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.labelKey} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t.common[stat.labelKey as keyof typeof t.common]}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? "..." : stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t.common.recentBookings}</h2>
            <Link href="/admin/bookings" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">{t.common.viewAll}</Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">{t.common.loading}</div>
            ) : (
              <table className="w-full">
                <thead><tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><th className="px-6 py-3">{t.common.user}</th><th className="px-6 py-3">{t.common.tour}</th><th className="px-6 py-3">{t.common.date}</th><th className="px-6 py-3">{t.common.amount}</th><th className="px-6 py-3">{t.common.status}</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.user?.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.tour?.titleEn || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${booking.finalPrice}</td>
                      <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-800"}`}>{booking.status}</span></td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">{t.admin.noBookings || "No bookings yet"}</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-semibold text-gray-900">{t.common.popularTours}</h2></div>
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="text-center text-gray-400 py-4">{t.common.loading}</div>
            ) : popularTours.map((tour, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{tour.titleEn}</p><p className="text-xs text-gray-500">{tour.totalBookings} {t.common.bookings}</p></div>
                <span className="text-sm font-semibold text-emerald-600">${(tour.price * tour.totalBookings).toLocaleString()}</span>
              </div>
            ))}
            {popularTours.length === 0 && !loading && <p className="text-center text-gray-400 py-4">{t.admin.noTours}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/tours" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>
          <div><p className="font-semibold text-gray-900">{t.admin.addNewTour}</p><p className="text-sm text-gray-500">{t.admin.createNewTour}</p></div>
        </Link>
        <Link href="/admin/users" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></div>
          <div><p className="font-semibold text-gray-900">{t.admin.manageUsers}</p><p className="text-sm text-gray-500">{t.admin.viewEditUsers}</p></div>
        </Link>
        <Link href="/admin/bookings" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
          <div><p className="font-semibold text-gray-900">{t.admin.viewReports}</p><p className="text-sm text-gray-500">{t.admin.analyticsReports}</p></div>
        </Link>
      </div>
    </div>
  );
}
