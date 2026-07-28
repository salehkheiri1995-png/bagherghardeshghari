"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

interface BookingItem {
  id: string;
  createdAt: string;
  guestName: string;
  guestEmail: string;
  numberOfGuests: number;
  finalPrice: number;
  status: string;
  paymentMethod: string;
  user: { name: string; email: string } | null;
  tour: { titleEn: string; slug: string; type: string } | null;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default function AdminBookingsPage() {
  const { t } = useI18n();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchBookings = async (status = "", searchQuery = "") => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ limit: "50" });
      if (status) params.set("status", status);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleFilter = (status: string) => {
    setFilterStatus(status);
    fetchBookings(status, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchBookings(filterStatus, value);
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchBookings(filterStatus, search);
    } catch (err) {
      console.error("Update booking error:", err);
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "User", "Tour", "Date", "Guests", "Amount", "Status", "Payment"];
    const rows = bookings.map((b) => [
      b.id,
      b.user?.name || b.guestName || "",
      b.tour?.titleEn || "",
      new Date(b.createdAt).toLocaleDateString(),
      b.numberOfGuests,
      b.finalPrice,
      b.status,
      b.paymentMethod || "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.bookingsManagement}</h1>
          <p className="text-gray-500 mt-1">{bookings.length} {t.admin.totalBookings}</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          {t.common.exportCSV}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder={t.common.search || "Search..."}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {["", "PENDING", "PAID", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
              <button key={status} onClick={() => handleFilter(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {status ? (t.common[status.toLowerCase() as keyof typeof t.common] || status) : t.common.all}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">{t.common.loading}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">{t.common.bookingId}</th>
                  <th className="px-6 py-3">{t.common.user}</th>
                  <th className="px-6 py-3">{t.common.tour}</th>
                  <th className="px-6 py-3">{t.common.date}</th>
                  <th className="px-6 py-3">{t.common.totalGuests}</th>
                  <th className="px-6 py-3">{t.common.amount}</th>
                  <th className="px-6 py-3">{t.common.payment}</th>
                  <th className="px-6 py-3">{t.common.status}</th>
                  <th className="px-6 py-3">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{booking.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{booking.user?.name || booking.guestName || "—"}</p>
                      <p className="text-xs text-gray-500">{booking.user?.email || booking.guestEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.tour?.titleEn || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.numberOfGuests}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${booking.finalPrice}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.paymentMethod || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-800"}`}>{booking.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer"
                      >
                        {["PENDING", "PAID", "CONFIRMED", "COMPLETED", "CANCELLED", "REFUNDED"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-400">{t.admin.noBookings || "No bookings found"}</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
