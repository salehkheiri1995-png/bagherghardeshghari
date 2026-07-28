"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";

const bookings = [
  { id: "B001", user: "John Smith", email: "john@example.com", tour: "Isfahan Cultural Tour", date: "2026-01-15", guests: 2, amount: 640, status: "CONFIRMED", payment: "Stripe" },
  { id: "B002", user: "Maria Garcia", email: "maria@example.com", tour: "Damavand Expedition", date: "2026-01-14", guests: 1, amount: 850, status: "PAID", payment: "PayPal" },
  { id: "B003", user: "Ahmed Al-Rashid", email: "ahmed@example.com", tour: "Lut Desert Adventure", date: "2026-01-13", guests: 3, amount: 2040, status: "PENDING", payment: "ZarinPal" },
  { id: "B004", user: "Ali Ahmadi", email: "ali@example.com", tour: "Shiraz & Persepolis", date: "2026-01-12", guests: 2, amount: 840, status: "CONFIRMED", payment: "Bank Transfer" },
  { id: "B005", user: "Sarah Johnson", email: "sarah@example.com", tour: "Hyrcanian Forest", date: "2026-01-11", guests: 2, amount: 900, status: "COMPLETED", payment: "Stripe" },
  { id: "B006", user: "Chen Wei", email: "chen@example.com", tour: "Historic Yazd Tour", date: "2026-01-10", guests: 1, amount: 180, status: "CANCELLED", payment: "PayPal" },
];

const statusColors: Record<string, string> = { PENDING: "bg-yellow-100 text-yellow-800", PAID: "bg-blue-100 text-blue-800", CONFIRMED: "bg-green-100 text-green-800", COMPLETED: "bg-emerald-100 text-emerald-800", CANCELLED: "bg-red-100 text-red-800", REFUNDED: "bg-gray-100 text-gray-800" };

export default function AdminBookingsPage() {
  const { t } = useI18n();
  const [filterStatus, setFilterStatus] = useState("");
  const filteredBookings = filterStatus ? bookings.filter((b) => b.status === filterStatus) : bookings;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">{t.admin.bookingsManagement}</h1><p className="text-gray-500 mt-1">{bookings.length} {t.admin.totalBookings}</p></div>
        <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>{t.common.exportCSV}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["", "PENDING", "PAID", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {status ? (t.common[status.toLowerCase() as keyof typeof t.common] || status) : t.common.all}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">{t.common.bookingId}</th><th className="px-6 py-3">{t.common.user}</th><th className="px-6 py-3">{t.common.tour}</th><th className="px-6 py-3">{t.common.date}</th><th className="px-6 py-3">{t.common.totalGuests}</th><th className="px-6 py-3">{t.common.amount}</th><th className="px-6 py-3">{t.common.payment}</th><th className="px-6 py-3">{t.common.status}</th><th className="px-6 py-3">{t.common.actions}</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{booking.id}</td>
                  <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900">{booking.user}</p><p className="text-xs text-gray-500">{booking.email}</p></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.tour}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.guests}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${booking.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.payment}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>{booking.status}</span></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                    <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                      <option>{t.common.actions}</option><option>{t.common.approve}</option><option>{t.common.cancel}</option><option>{t.common.sendEmail}</option>
                    </select>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
