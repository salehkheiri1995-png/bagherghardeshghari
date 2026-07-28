"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

const bookings = [
  { id: "1", tourTitle: "Isfahan Cultural Heritage Tour", date: "March 15-17, 2026", guests: 2, status: "CONFIRMED", totalPrice: 640 },
  { id: "2", tourTitle: "Mount Damavand Summit Expedition", date: "July 1-5, 2026", guests: 1, status: "PAID", totalPrice: 850 },
  { id: "3", tourTitle: "Hyrcanian Forest Adventure", date: "April 20-23, 2025", guests: 2, status: "COMPLETED", totalPrice: 900 },
];

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function BookingsPage() {
  const { t } = useI18n();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.dashboard.myBookings}</h1>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                  {booking.tourTitle.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.tourTitle}</h3>
                    <p className="text-gray-500 text-sm mt-1">{booking.date} &bull; {booking.guests} {t.common.guests}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status] || "bg-gray-100 text-gray-800"}`}>{booking.status}</span>
                    <span className="text-lg font-bold text-gray-900">${booking.totalPrice}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href="/tours" className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                    {t.dashboard.viewTour}
                  </Link>
                  {booking.status === "CONFIRMED" && (
                    <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      {t.dashboard.cancelBooking}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.dashboard.noBookings}</h3>
            <p className="text-gray-500 mb-4">{t.dashboard.startExploring}</p>
            <Link href="/tours" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              {t.dashboard.browseTours}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
