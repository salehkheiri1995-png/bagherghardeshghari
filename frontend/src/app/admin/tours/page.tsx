"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";
import { parseJsonField } from "@/utils/json-helpers";

interface ItineraryDay {
  day: number;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  activities: string[];
  activitiesFa: string[];
  accommodation: string;
  accommodationFa: string;
}

interface TourItem {
  id: string;
  title: string;
  titleEn: string;
  titleFa: string;
  type: string;
  province: string;
  location: string;
  durationDays: number;
  price: number;
  capacity: number;
  status: string;
  slug: string;
  difficulty: string;
  descriptionEn: string;
  descriptionFa: string;
  includes: string[];
  includesFa: string[];
  excludes: string[];
  excludesFa: string[];
  requirements: string[];
  requirementsFa: string[];
  itinerary: ItineraryDay[];
  imageUrl: string | null;
  _count: { bookings: number; reviews: number };
  averageRating: number;
}

const emptyDay = (): ItineraryDay => ({
  day: 0,
  title: "",
  titleFa: "",
  description: "",
  descriptionFa: "",
  activities: [],
  activitiesFa: [],
  accommodation: "",
  accommodationFa: "",
});

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminToursPage() {
  const { t, locale } = useI18n();
  const isFa = locale === "fa";
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState<TourItem | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "fa" | "itinerary">("en");
  const [formData, setFormData] = useState({
    titleEn: "", titleFa: "",
    type: "CITY", difficulty: "MODERATE", province: "", durationDays: 3, price: 0, capacity: 15,
    descriptionEn: "", descriptionFa: "",
    includes: "", includesFa: "",
    excludes: "", excludesFa: "",
    requirements: "", requirementsFa: "",
    location: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
    status: "PUBLISHED",
  });
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchTours = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/tours?limit=50", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const parsed = data.data.map((tour: Record<string, unknown>) => ({
          ...tour,
          includes: parseJsonField<string>(tour.includes as string),
          includesFa: parseJsonField<string>(tour.includesFa as string),
          excludes: parseJsonField<string>(tour.excludes as string),
          excludesFa: parseJsonField<string>(tour.excludesFa as string),
          requirements: parseJsonField<string>(tour.requirements as string),
          requirementsFa: parseJsonField<string>(tour.requirementsFa as string),
          itinerary: parseJsonField(tour.itinerary as string),
        }));
        setTours(parsed);
      }
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTours(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingTour(null);
    setActiveTab("en");
    setFormData({
      titleEn: "", titleFa: "",
      type: "CITY", difficulty: "MODERATE", province: "", durationDays: 3, price: 0, capacity: 15,
      descriptionEn: "", descriptionFa: "",
      includes: "", includesFa: "", excludes: "", excludesFa: "",
      requirements: "", requirementsFa: "", location: "", imageUrl: "",
      latitude: "", longitude: "",
      status: "PUBLISHED",
    });
    setItinerary([]);
    setShowModal(true);
  };

  const openEditModal = (tour: TourItem) => {
    setEditingTour(tour);
    setActiveTab("en");
    setFormData({
      titleEn: tour.titleEn, titleFa: tour.titleFa || "",
      type: tour.type, difficulty: tour.difficulty, province: tour.province,
      durationDays: tour.durationDays, price: tour.price, capacity: tour.capacity,
      descriptionEn: tour.descriptionEn, descriptionFa: tour.descriptionFa || "",
      includes: (tour.includes || []).join("\n"),
      includesFa: (tour.includesFa || []).join("\n"),
      excludes: (tour.excludes || []).join("\n"),
      excludesFa: (tour.excludesFa || []).join("\n"),
      requirements: (tour.requirements || []).join("\n"),
      requirementsFa: (tour.requirementsFa || []).join("\n"),
      location: tour.location || "",
      imageUrl: (tour as unknown as Record<string, string>).imageUrl || "",
      latitude: (tour as unknown as Record<string, string>).latitude || "",
      longitude: (tour as unknown as Record<string, string>).longitude || "",
      status: tour.status || "PUBLISHED",
    });
    setItinerary(
      (tour.itinerary || []).map((day, i) => ({
        ...day,
        day: i + 1,
        titleFa: day.titleFa || "",
        descriptionFa: day.descriptionFa || "",
        activitiesFa: day.activitiesFa || [],
        accommodation: day.accommodation || "",
        accommodationFa: day.accommodationFa || "",
      }))
    );
    setShowModal(true);
  };

  const addDay = () => {
    const newDay = emptyDay();
    newDay.day = itinerary.length + 1;
    setItinerary([...itinerary, newDay]);
  };

  const removeDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(updated);
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: string) => {
    const updated = [...itinerary];
    if (field === "activities" || field === "activitiesFa") {
      (updated[index] as unknown as Record<string, unknown>)[field] = value.split("\n").filter(Boolean);
    } else {
      (updated[index] as unknown as Record<string, unknown>)[field] = value;
    }
    setItinerary(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "tours");
      const token = localStorage.getItem("token");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, imageUrl: data.data.url });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      ...(editingTour ? { tourId: editingTour.id } : {}),
      title: formData.titleFa || formData.titleEn,
      titleEn: formData.titleEn,
      titleFa: formData.titleFa,
      type: formData.type,
      difficulty: formData.difficulty,
      province: formData.province,
      durationDays: Number(formData.durationDays),
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      location: formData.location,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      imageUrl: formData.imageUrl || null,
      description: formData.descriptionFa || formData.descriptionEn,
      descriptionEn: formData.descriptionEn,
      descriptionFa: formData.descriptionFa,
      includes: formData.includes.split("\n").filter(Boolean),
      includesFa: formData.includesFa.split("\n").filter(Boolean),
      excludes: formData.excludes.split("\n").filter(Boolean),
      excludesFa: formData.excludesFa.split("\n").filter(Boolean),
      requirements: formData.requirements.split("\n").filter(Boolean),
      requirementsFa: formData.requirementsFa.split("\n").filter(Boolean),
      status: formData.status,
      itinerary: itinerary.map((day) => ({
        day: day.day,
        title: day.title,
        titleFa: day.titleFa,
        description: day.description,
        descriptionFa: day.descriptionFa,
        activities: typeof day.activities === "string" ? (day.activities as string).split("\n").filter(Boolean) : day.activities,
        activitiesFa: typeof day.activitiesFa === "string" ? (day.activitiesFa as string).split("\n").filter(Boolean) : day.activitiesFa,
        accommodation: day.accommodation,
        accommodationFa: day.accommodationFa,
      })),
    };

    try {
      const method = editingTour ? "PUT" : "POST";
      const res = await fetch("/api/admin/tours", {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchTours();
      } else {
        alert(data.error || "Failed to save tour");
      }
    } catch (err) {
      console.error("Save tour error:", err);
    }
  };

  const typeLabels: Record<string, string> = {
    MOUNTAIN: t.tours?.typeMOUNTAIN || "Mountaineering",
    FOREST: t.tours?.typeFOREST || "Forest",
    CITY: t.tours?.typeCITY || "City Tour",
    VILLAGE: t.tours?.typeVILLAGE || "Village",
    NATURE: t.tours?.typeNATURE || "Nature",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.toursManagement}</h1>
          <p className="text-gray-500 mt-1">{tours.length} {t.admin.totalTours}</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          {t.admin.addTour}
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
                  <th className="px-6 py-3">{t.common.tour}</th>
                  <th className="px-6 py-3">{t.common.type}</th>
                  <th className="px-6 py-3">{t.admin.province}</th>
                  <th className="px-6 py-3">{t.common.days}</th>
                  <th className="px-6 py-3">{t.common.price}</th>
                  <th className="px-6 py-3">{t.common.bookings}</th>
                  <th className="px-6 py-3">{t.common.status}</th>
                  <th className="px-6 py-3">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {(tour as unknown as Record<string, string>).imageUrl ? (
                          <img src={(tour as unknown as Record<string, string>).imageUrl} alt="" className="w-12 h-9 object-cover rounded border border-gray-200" />
                        ) : (
                          <div className="w-12 h-9 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tour.titleEn}</p>
                          {tour.titleFa && <p className="text-xs text-gray-400" dir="rtl">{tour.titleFa}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded font-medium">{typeLabels[tour.type] || tour.type}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tour.province}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tour.durationDays} {t.common.days}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${tour.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tour._count?.bookings || 0}</td>
                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[tour.status] || "bg-gray-100 text-gray-800"}`}>{tour.status}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(tour)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(tour.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tours.length === 0 && <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">{t.admin.noTours}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-900">{editingTour ? t.admin.editTour : t.admin.addNewTour}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 flex gap-2 sticky top-[65px] bg-white z-10">
              {(["en", "fa", "itinerary"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:bg-gray-100"}`}>
                  {tab === "en" ? "English" : tab === "fa" ? "فارسی" : t.admin.itinerary || "Itinerary"}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tour Image</label>
                <div className="flex items-start gap-4">
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img src={formData.imageUrl} alt="Tour" className="w-40 h-28 object-cover rounded-lg border border-gray-200" />
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
                          <span className="text-xs text-gray-500">Upload Image</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                  <div className="text-xs text-gray-400">
                    <p>JPG, PNG or WebP. Max 5MB.</p>
                    <p className="mt-1">Recommended: 800x600px</p>
                  </div>
                </div>
              </div>

              {activeTab === "en" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label>
                    <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Includes (one per line)</label>
                    <textarea name="includes" value={formData.includes} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excludes (one per line)</label>
                    <textarea name="excludes" value={formData.excludes} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                    <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" />
                  </div>
                </>
              )}

              {activeTab === "fa" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">عنوان (فارسی)</label>
                    <input type="text" name="titleFa" value={formData.titleFa} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">توضیحات (فارسی)</label>
                    <textarea name="descriptionFa" value={formData.descriptionFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">شامل می‌شود (هر خط یک مورد)</label>
                    <textarea name="includesFa" value={formData.includesFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">شامل نمی‌شود (هر خط یک مورد)</label>
                    <textarea name="excludesFa" value={formData.excludesFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">الزامات (هر خط یک مورد)</label>
                    <textarea name="requirementsFa" value={formData.requirementsFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" dir="rtl" />
                  </div>
                </>
              )}

              {activeTab === "itinerary" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{t.admin.itinerary || "Itinerary"}</h3>
                    <button onClick={addDay} className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      {t.admin.addDay || "Add Day"}
                    </button>
                  </div>

                  {itinerary.length === 0 && (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                      <p>{t.admin.noDays || "No days added yet. Click 'Add Day' to start building the itinerary."}</p>
                    </div>
                  )}

                  {itinerary.map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">{day.day}</div>
                          <span className="font-semibold text-gray-900">{t.tourDetail.dayPrefix || "Day"} {day.day}</span>
                        </div>
                        <button onClick={() => removeDay(index)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Title (EN)</label>
                          <input type="text" value={day.title} onChange={(e) => updateDay(index, "title", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Arrival in Mazandaran" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1" dir="rtl">عنوان (FA)</label>
                          <input type="text" value={day.titleFa} onChange={(e) => updateDay(index, "titleFa", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" dir="rtl" placeholder="مثلاً ورود به مازندران" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Description (EN)</label>
                          <textarea value={day.description} onChange={(e) => updateDay(index, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 resize-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1" dir="rtl">توضیحات (FA)</label>
                          <textarea value={day.descriptionFa} onChange={(e) => updateDay(index, "descriptionFa", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 resize-none" dir="rtl" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Activities (EN, one per line)</label>
                          <textarea
                            value={(day.activities || []).join("\n")}
                            onChange={(e) => updateDay(index, "activities", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 resize-none font-mono text-xs"
                            placeholder={"Transfer\nWelcome dinner"}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1" dir="rtl">فعالیت‌ها (FA، هر خط یک مورد)</label>
                          <textarea
                            value={(day.activitiesFa || []).join("\n")}
                            onChange={(e) => updateDay(index, "activitiesFa", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 resize-none font-mono text-xs"
                            dir="rtl"
                            placeholder={"انتقال\nشام خوش‌آمدگویی"}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Accommodation (EN)</label>
                          <input type="text" value={day.accommodation} onChange={(e) => updateDay(index, "accommodation", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Eco-lodge" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1" dir="rtl">اقامت (FA)</label>
                          <input type="text" value={day.accommodationFa} onChange={(e) => updateDay(index, "accommodationFa", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" dir="rtl" placeholder="مثلاً اقامتگاه بوم‌گردی" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab !== "itinerary" && (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.type} *</label>
                      <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                        <option value="MOUNTAIN">{t.tours?.typeMOUNTAIN || "Mountaineering"}</option>
                        <option value="FOREST">{t.tours?.typeFOREST || "Forest"}</option>
                        <option value="CITY">{t.tours?.typeCITY || "City Tour"}</option>
                        <option value="VILLAGE">{t.tours?.typeVILLAGE || "Village"}</option>
                        <option value="NATURE">{t.tours?.typeNATURE || "Nature"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.tourDetail.difficulty || "Difficulty"}</label>
                      <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                        <option value="EASY">{t.tours?.easyLabel || "Easy"}</option>
                        <option value="MODERATE">{t.tours?.moderateLabel || "Moderate"}</option>
                        <option value="HARD">{t.tours?.hardLabel || "Hard"}</option>
                        <option value="VERY_HARD">{t.tours?.veryHardLabel || "Very Hard"}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.province}</label>
                      <input type="text" name="province" value={formData.province} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.durationDays}</label>
                      <input type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} min="1" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.price} *</label>
                      <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.capacity}</label>
                      <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.location}</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.status || "Status"}</label>
                      <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                        <option value="PUBLISHED">PUBLISHED ✅</option>
                        <option value="DRAFT">DRAFT 📝</option>
                        <option value="CANCELLED">CANCELLED ❌</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? "عرض جغرافیایی (Latitude)" : "Latitude"}</label>
                      <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="e.g. 32.6546" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? "طول جغرافیایی (Longitude)" : "Longitude"}</label>
                      <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="e.g. 51.6680" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">{t.common.cancel}</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                {editingTour ? t.admin.updateTour : t.admin.createTour}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function handleDelete(tourId: string) {
    if (!confirm("Are you sure you want to delete this tour?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/tours?tourId=${tourId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchTours();
    } catch (err) {
      console.error("Delete tour error:", err);
    }
  }
}
