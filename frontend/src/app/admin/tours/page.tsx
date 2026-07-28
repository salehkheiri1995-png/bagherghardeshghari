"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

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
  description: string;
  descriptionEn: string;
  descriptionFa: string;
  includes: string[];
  includesFa: string[];
  excludes: string[];
  excludesFa: string[];
  requirements: string[];
  requirementsFa: string[];
  itinerary: { day: number; title: string; titleFa: string; description: string; descriptionFa: string; activities: string[]; activitiesFa: string[]; accommodation?: string; accommodationFa?: string }[];
  itineraryFa: { day: number; title: string; titleFa: string; description: string; descriptionFa: string; activities: string[]; activitiesFa: string[]; accommodation?: string; accommodationFa?: string }[];
  _count: { bookings: number; reviews: number };
  averageRating: number;
}

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminToursPage() {
  const { t } = useI18n();
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState<TourItem | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "fa">("en");
  const [formData, setFormData] = useState({
    title: "", titleEn: "", titleFa: "",
    type: "CITY", difficulty: "MODERATE", province: "", durationDays: 3, price: 0, capacity: 15,
    description: "", descriptionEn: "", descriptionFa: "",
    includes: "", includesFa: "",
    excludes: "", excludesFa: "",
    requirements: "", requirementsFa: "",
    location: "",
  });

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
          includes: typeof tour.includes === "string" ? JSON.parse(tour.includes as string) : (tour.includes || []),
          includesFa: typeof tour.includesFa === "string" ? JSON.parse(tour.includesFa as string) : (tour.includesFa || []),
          excludes: typeof tour.excludes === "string" ? JSON.parse(tour.excludes as string) : (tour.excludes || []),
          excludesFa: typeof tour.excludesFa === "string" ? JSON.parse(tour.excludesFa as string) : (tour.excludesFa || []),
          requirements: typeof tour.requirements === "string" ? JSON.parse(tour.requirements as string) : (tour.requirements || []),
          requirementsFa: typeof tour.requirementsFa === "string" ? JSON.parse(tour.requirementsFa as string) : (tour.requirementsFa || []),
          itinerary: typeof tour.itinerary === "string" ? JSON.parse(tour.itinerary as string) : (tour.itinerary || []),
          itineraryFa: typeof tour.itineraryFa === "string" ? JSON.parse(tour.itineraryFa as string) : (tour.itineraryFa || []),
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
      title: "", titleEn: "", titleFa: "",
      type: "CITY", difficulty: "MODERATE", province: "", durationDays: 3, price: 0, capacity: 15,
      description: "", descriptionEn: "", descriptionFa: "",
      includes: "", includesFa: "", excludes: "", excludesFa: "",
      requirements: "", requirementsFa: "", location: "",
    });
    setShowModal(true);
  };

  const openEditModal = (tour: TourItem) => {
    setEditingTour(tour);
    setActiveTab("en");
    setFormData({
      title: tour.title, titleEn: tour.titleEn, titleFa: tour.titleFa || "",
      type: tour.type, difficulty: tour.difficulty, province: tour.province,
      durationDays: tour.durationDays, price: tour.price, capacity: tour.capacity,
      description: tour.description, descriptionEn: tour.descriptionEn, descriptionFa: tour.descriptionFa || "",
      includes: (tour.includes || []).join("\n"),
      includesFa: (tour.includesFa || []).join("\n"),
      excludes: (tour.excludes || []).join("\n"),
      excludesFa: (tour.excludesFa || []).join("\n"),
      requirements: (tour.requirements || []).join("\n"),
      requirementsFa: (tour.requirementsFa || []).join("\n"),
      location: tour.location || "",
    });
    setShowModal(true);
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
      description: formData.descriptionFa || formData.description,
      descriptionEn: formData.descriptionEn,
      descriptionFa: formData.descriptionFa,
      includes: formData.includes.split("\n").filter(Boolean),
      includesFa: formData.includesFa.split("\n").filter(Boolean),
      excludes: formData.excludes.split("\n").filter(Boolean),
      excludesFa: formData.excludesFa.split("\n").filter(Boolean),
      requirements: formData.requirements.split("\n").filter(Boolean),
      requirementsFa: formData.requirementsFa.split("\n").filter(Boolean),
      itinerary: [],
      itineraryFa: [],
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
      alert("Failed to save tour");
    }
  };

  const handleDelete = async (tourId: string) => {
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
          <div className="p-8 text-center text-gray-500">{t.common.loading || "Loading..."}</div>
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
                  <th className="px-6 py-3">{t.common.rating}</th>
                  <th className="px-6 py-3">{t.common.status}</th>
                  <th className="px-6 py-3">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{tour.titleEn}</p>
                      {tour.titleFa && <p className="text-xs text-gray-400" dir="rtl">{tour.titleFa}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded font-medium">{typeLabels[tour.type] || tour.type}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tour.province}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tour.durationDays} {t.common.days}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${tour.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tour._count?.bookings || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">⭐ {tour.averageRating || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[tour.status] || "bg-gray-100 text-gray-800"}`}>{tour.status}</span>
                    </td>
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
                {tours.length === 0 && (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-400">{t.admin.noTours || "No tours found"}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">{editingTour ? t.admin.editTour || "Edit Tour" : t.admin.addNewTour}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-6 py-4 border-b border-gray-100 flex gap-4">
              <button onClick={() => setActiveTab("en")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "en" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:bg-gray-100"}`}>
                English
              </button>
              <button onClick={() => setActiveTab("fa")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "fa" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:bg-gray-100"}`}>
                فارسی (Farsi)
              </button>
            </div>

            <div className="p-6 space-y-4">
              {activeTab === "en" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label>
                    <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Tour title in English" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" placeholder="Tour description in English" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Includes (one per line)</label>
                    <textarea name="includes" value={formData.includes} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" placeholder={"Professional guide\nHotel accommodation\nMeals"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excludes (one per line)</label>
                    <textarea name="excludes" value={formData.excludes} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" placeholder={"Flights\nTravel insurance\nPersonal expenses"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                    <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" placeholder={"Good fitness\nComfortable shoes"} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">عنوان (فارسی)</label>
                    <input type="text" name="titleFa" value={formData.titleFa} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" dir="rtl" placeholder="عنوان تور به فارسی" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">توضیحات (فارسی)</label>
                    <textarea name="descriptionFa" value={formData.descriptionFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" dir="rtl" placeholder="توضیحات تور به فارسی" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">شامل می‌شود (هر خط یک مورد)</label>
                    <textarea name="includesFa" value={formData.includesFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" dir="rtl" placeholder={"راهنمای حرفه‌ای\nاقامت در هتل\nوعده‌های غذایی"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">شامل نمی‌شود (هر خط یک مورد)</label>
                    <textarea name="excludesFa" value={formData.excludesFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" dir="rtl" placeholder={"پروازها\nبیمه مسافرتی\nهزینه‌های شخصی"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">الزامات (هر خط یک مورد)</label>
                    <textarea name="requirementsFa" value={formData.requirementsFa} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none font-mono text-xs" dir="rtl" placeholder={"آمادگی جسمانی\nکفش راحت"} />
                  </div>
                </>
              )}

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
                  <input type="text" name="province" value={formData.province} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. Isfahan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.durationDays || "Duration (days)"}</label>
                  <input type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} min="1" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.price} *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.capacity || "Capacity"}</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.location || "Location"}</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. Isfahan, Iran" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">{t.common.cancel}</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                {editingTour ? t.admin.updateTour || "Update Tour" : t.admin.createTour}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
