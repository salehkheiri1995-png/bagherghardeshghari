"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

interface TourOption {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
}

interface PastTourItem {
  id: string;
  tourId: string;
  title: string;
  titleFa: string | null;
  description: string;
  descriptionFa: string | null;
  date: string;
  guideName: string;
  guideNameFa: string | null;
  location: string;
  locationFa: string | null;
  photos: number;
  imageUrl: string | null;
  galleryImages: string[];
  highlights: string[];
  highlightsFa: string | null;
  participants: number | null;
  rating: number | null;
  weather: string | null;
  weatherFa: string | null;
  tour: { title: string; titleEn: string; slug: string };
}

export default function AdminPastToursPage() {
  const { t } = useI18n();
  const [pastTours, setPastTours] = useState<PastTourItem[]>([]);
  const [tours, setTours] = useState<TourOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PastTourItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    tourId: "", title: "", titleFa: "", description: "", descriptionFa: "",
    date: "", guideName: "", guideNameFa: "", location: "", locationFa: "",
    photos: 0, imageUrl: "", highlights: "", highlightsFa: "",
    participants: 0, rating: 0, weather: "", weatherFa: "",
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [pastRes, toursRes] = await Promise.all([
        fetch("/api/admin/past-tours", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/tours?limit=100", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const pastData = await pastRes.json();
      const toursData = await toursRes.json();
      if (pastData.success) {
        setPastTours(pastData.data.map((pt: Record<string, unknown>) => ({
          ...pt,
          galleryImages: typeof pt.galleryImages === "string" ? JSON.parse(pt.galleryImages as string) : (pt.galleryImages || []),
          highlights: typeof pt.highlights === "string" ? JSON.parse(pt.highlights as string) : (pt.highlights || []),
        })));
      }
      if (toursData.success) setTours(toursData.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      tourId: tours[0]?.id || "", title: "", titleFa: "", description: "", descriptionFa: "",
      date: "", guideName: "", guideNameFa: "", location: "", locationFa: "",
      photos: 0, imageUrl: "", highlights: "", highlightsFa: "",
      participants: 0, rating: 0, weather: "", weatherFa: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item: PastTourItem) => {
    setEditingItem(item);
    setFormData({
      tourId: item.tourId, title: item.title, titleFa: item.titleFa || "",
      description: item.description, descriptionFa: item.descriptionFa || "",
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      guideName: item.guideName, guideNameFa: item.guideNameFa || "",
      location: item.location, locationFa: item.locationFa || "",
      photos: item.photos, imageUrl: item.imageUrl || "",
      highlights: (item.highlights || []).join("\n"),
      highlightsFa: item.highlightsFa || "",
      participants: item.participants || 0, rating: item.rating || 0,
      weather: item.weather || "", weatherFa: item.weatherFa || "",
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "past-tours");
      const token = localStorage.getItem("token");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) setFormData({ ...formData, imageUrl: data.data.url });
      else alert(data.error || "Upload failed");
    } catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      ...(editingItem ? { pastTourId: editingItem.id } : {}),
      tourId: formData.tourId,
      title: formData.title,
      titleFa: formData.titleFa || null,
      description: formData.description,
      descriptionFa: formData.descriptionFa || null,
      date: formData.date,
      guideName: formData.guideName,
      guideNameFa: formData.guideNameFa || null,
      location: formData.location,
      locationFa: formData.locationFa || null,
      photos: Number(formData.photos),
      imageUrl: formData.imageUrl || null,
      highlights: formData.highlights.split("\n").filter(Boolean),
      highlightsFa: formData.highlightsFa || null,
      participants: Number(formData.participants) || null,
      rating: Number(formData.rating) || null,
      weather: formData.weather || null,
      weatherFa: formData.weatherFa || null,
    };

    try {
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch("/api/admin/past-tours", {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) { setShowModal(false); fetchData(); }
      else alert(data.error || "Failed to save");
    } catch { alert("Failed to save"); }
  };

  const handleDelete = async (pastTourId: string) => {
    if (!confirm("Are you sure you want to delete this past tour?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/past-tours?pastTourId=${pastTourId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch { alert("Delete failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.pastToursManagement}</h1>
          <p className="text-gray-500 mt-1">{pastTours.length} {t.admin.pastTours}</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          {t.admin.addPastTour}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">{t.common.loading}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Tour</th>
                  <th className="px-6 py-3">{t.admin.tourDate}</th>
                  <th className="px-6 py-3">{t.admin.guideName}</th>
                  <th className="px-6 py-3">{t.common.location}</th>
                  <th className="px-6 py-3">{t.admin.photoCount}</th>
                  <th className="px-6 py-3">{t.admin.participants}</th>
                  <th className="px-6 py-3">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pastTours.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="w-12 h-9 object-cover rounded border border-gray-200" />
                        ) : (
                          <div className="w-12 h-9 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-400">{item.tour?.titleEn || item.tourId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.guideName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.photos}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.participants || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pastTours.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">{t.admin.noPastTours}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? t.admin.editPastTour : t.admin.addPastTour}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour *</label>
                <select name="tourId" value={formData.tourId} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                  <option value="">Select a tour</option>
                  {tours.map((tour) => <option key={tour.id} value={tour.id}>{tour.titleEn}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="flex items-start gap-4">
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img src={formData.imageUrl} alt="" className="w-40 h-28 object-cover rounded-lg border border-gray-200" />
                      <button onClick={() => setFormData({ ...formData, imageUrl: "" })} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <label className="w-40 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                      {uploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="text-xs text-gray-500">Upload</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">عنوان (فارسی)</label>
                <input type="text" name="titleFa" value={formData.titleFa} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" dir="rtl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.tourDate} *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.guideName} *</label>
                  <input type="text" name="guideName" value={formData.guideName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">نام راهنما (فارسی)</label>
                <input type="text" name="guideNameFa" value={formData.guideNameFa} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" dir="rtl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.location}</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">مکان (فارسی)</label>
                  <input type="text" name="locationFa" value={formData.locationFa} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.photoCount}</label>
                  <input type="number" name="photos" value={formData.photos} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.participants}</label>
                  <input type="number" name="participants" value={formData.participants} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.weather}</label>
                  <input type="text" name="weather" value={formData.weather} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. Sunny, 25°C" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">آب و هوا (فارسی)</label>
                  <input type="text" name="weatherFa" value={formData.weatherFa} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" dir="rtl" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">توضیحات (فارسی)</label>
                <textarea name="descriptionFa" value={formData.descriptionFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" dir="rtl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (one per line)</label>
                <textarea name="highlights" value={formData.highlights} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">نکات برجسته (فارسی، هر خط یک مورد)</label>
                <textarea name="highlightsFa" value={formData.highlightsFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" dir="rtl" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">{t.common.cancel}</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                {editingItem ? t.admin.updatePastTour : t.admin.createPastTour}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
