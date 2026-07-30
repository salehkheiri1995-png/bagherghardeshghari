"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

interface TourOption {
  id: string;
  titleEn: string;
  titleFa: string;
  slug: string;
  price: number;
  capacity: number;
}

interface TourDateItem {
  id: string;
  startDate: string;
  endDate: string;
  availableSpots: number;
  maxCapacity: number;
  specialPrice: number | null;
  notes: string | null;
  isActive: boolean;
  tour: TourOption;
  _count: { bookings: number };
}

export default function AdminTourDatesPage() {
  const { t, formatCurrency } = useI18n();
  const [tourDates, setTourDates] = useState<TourDateItem[]>([]);
  const [tours, setTours] = useState<TourOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTourId, setSelectedTourId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDate, setEditingDate] = useState<TourDateItem | null>(null);
  const [formData, setFormData] = useState({
    tourId: "",
    startDate: "",
    endDate: "",
    maxCapacity: 0,
    availableSpots: 0,
    specialPrice: "",
    notes: "",
  });

  const fetchTours = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/tours?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTours(data.data.map((tour: Record<string, unknown>) => ({
          id: tour.id as string,
          titleEn: tour.titleEn as string,
          titleFa: tour.titleFa as string,
          slug: tour.slug as string,
          price: tour.price as number,
          capacity: tour.capacity as number,
        })));
      }
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    }
  };

  const fetchTourDates = async (tourId = "") => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ limit: "100" });
      if (tourId) params.set("tourId", tourId);
      const res = await fetch(`/api/admin/tour-dates?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTourDates(data.data);
    } catch (err) {
      console.error("Failed to fetch tour dates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
    fetchTourDates();
  }, []);

  const handleFilterTour = (tourId: string) => {
    setSelectedTourId(tourId);
    fetchTourDates(tourId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingDate(null);
    setFormData({
      tourId: selectedTourId || (tours[0]?.id || ""),
      startDate: "",
      endDate: "",
      maxCapacity: 0,
      availableSpots: 0,
      specialPrice: "",
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (date: TourDateItem) => {
    setEditingDate(date);
    setFormData({
      tourId: date.tour.id,
      startDate: date.startDate.split("T")[0],
      endDate: date.endDate.split("T")[0],
      maxCapacity: date.maxCapacity,
      availableSpots: date.availableSpots,
      specialPrice: date.specialPrice?.toString() || "",
      notes: date.notes || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.tourId || !formData.startDate || !formData.endDate) {
      alert("Tour, start date, and end date are required");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = editingDate
      ? {
          tourDateId: editingDate.id,
          startDate: formData.startDate,
          endDate: formData.endDate,
          maxCapacity: Number(formData.maxCapacity),
          availableSpots: Number(formData.availableSpots),
          specialPrice: formData.specialPrice ? Number(formData.specialPrice) : null,
          notes: formData.notes || null,
        }
      : {
          tourId: formData.tourId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          maxCapacity: Number(formData.maxCapacity) || undefined,
          specialPrice: formData.specialPrice ? Number(formData.specialPrice) : null,
          notes: formData.notes || null,
        };

    try {
      const method = editingDate ? "PUT" : "POST";
      const res = await fetch("/api/admin/tour-dates", {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchTourDates(selectedTourId);
      } else {
        alert(data.error || "Failed to save tour date");
      }
    } catch (err) {
      console.error("Save tour date error:", err);
    }
  };

  const handleDelete = async (tourDateId: string) => {
    if (!confirm("Are you sure you want to delete this tour date?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/tour-dates?tourDateId=${tourDateId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchTourDates(selectedTourId);
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete tour date error:", err);
    }
  };

  const handleToggleActive = async (date: TourDateItem) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/tour-dates", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tourDateId: date.id, isActive: !date.isActive }),
      });
      const data = await res.json();
      if (data.success) fetchTourDates(selectedTourId);
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.tourDatesManagement}</h1>
          <p className="text-gray-500 mt-1">{tourDates.length} {t.admin.totalTourDates || "tour dates"}</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          {t.admin.addTourDate || "Add Tour Date"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-medium text-gray-700">{t.common.tour}:</label>
          <select
            value={selectedTourId}
            onChange={(e) => handleFilterTour(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white min-w-[250px]"
          >
            <option value="">{t.common.all} ({tours.length})</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>{tour.titleEn}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">{t.common.loading}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">{t.common.tour}</th>
                  <th className="px-6 py-3">{t.admin.startDate}</th>
                  <th className="px-6 py-3">{t.admin.endDate}</th>
                  <th className="px-6 py-3">{t.common.days}</th>
                  <th className="px-6 py-3">{t.admin.capacity || "Capacity"}</th>
                  <th className="px-6 py-3">{t.common.spotsLeft}</th>
                  <th className="px-6 py-3">{t.common.bookings}</th>
                  <th className="px-6 py-3">{t.common.status}</th>
                  <th className="px-6 py-3">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tourDates.map((date) => {
                  const start = new Date(date.startDate);
                  const end = new Date(date.endDate);
                  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={date.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{date.tour.titleEn}</p>
                        {date.tour.titleFa && <p className="text-xs text-gray-400" dir="rtl">{date.tour.titleFa}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{start.toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{end.toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{days} {t.common.days}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{date.maxCapacity}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${date.availableSpots === 0 ? "text-red-600" : date.availableSpots <= 3 ? "text-amber-600" : "text-green-600"}`}>
                          {date.availableSpots}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{date._count?.bookings || 0}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(date)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${date.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                        >
                          {date.isActive ? t.common.active : t.common.inactive}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(date)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => handleDelete(date.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {tourDates.length === 0 && (
                  <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-400">{t.admin.noTourDates || "No tour dates found"}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">{editingDate ? t.admin.editTourDate || "Edit Tour Date" : t.admin.addTourDate || "Add Tour Date"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.tour} *</label>
                <select name="tourId" value={formData.tourId} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white" disabled={!!editingDate}>
                  <option value="">{t.admin.selectTour || "Select a tour"}</option>
                  {tours.map((tour) => (
                    <option key={tour.id} value={tour.id}>{tour.titleEn} ({formatCurrency(tour.price)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.startDate} *</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.endDate} *</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.capacity || "Max Capacity"}</label>
                  <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} min="1" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                {editingDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.spotsLeft}</label>
                    <input type="number" name="availableSpots" value={formData.availableSpots} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.specialPrice || "Special Price (optional)"}</label>
                <input type="number" name="specialPrice" value={formData.specialPrice} onChange={handleChange} min="0" step="0.01" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Leave empty for regular price" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.description || "Notes (optional)"}</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">{t.common.cancel}</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                {editingDate ? t.admin.updateTourDate || "Update" : t.admin.createTourDate || "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
