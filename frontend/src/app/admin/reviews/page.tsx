"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  comment: string;
  pros: string;
  cons: string;
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
  user: { name: string; email: string } | null;
  tour: { titleEn: string; slug: string } | null;
}

export default function AdminReviewsPage() {
  const { t } = useI18n();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved">("all");

  const fetchReviews = async (status = "") => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ limit: "50" });
      if (status) params.set("status", status);
      const res = await fetch(`/api/admin/reviews?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleFilter = (status: "all" | "pending" | "approved") => {
    setFilterStatus(status);
    fetchReviews(status === "all" ? "" : status);
  };

  const handleApprove = async (reviewId: string, isApproved: boolean) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reviewId, isApproved }),
      });
      const data = await res.json();
      if (data.success) fetchReviews(filterStatus === "all" ? "" : filterStatus);
    } catch (err) {
      console.error("Approve review error:", err);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm(t.admin.areYouSureDeleteReview)) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchReviews(filterStatus === "all" ? "" : filterStatus);
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.reviewsManagement}</h1>
          <p className="text-gray-500 mt-1">{reviews.length} {t.common.totalReviews}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {t.common[status] || status.charAt(0).toUpperCase() + status.slice(1)} (
                {status === "all" ? reviews.length : status === "pending" ? pendingCount : approvedCount}
              )
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">{t.common.loading}</div>
        ) : reviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-xl shadow-sm border p-6 ${review.isApproved ? "border-gray-100" : "border-amber-200 bg-amber-50/30"}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{review.user?.name || t.admin.anonymous}</span>
                  {review.isVerified && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{t.common.verified}</span>}
                  {!review.isApproved && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">{t.common.pendingApproval}</span>}
                  <span className="text-sm text-gray-400">&bull;</span>
                  <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{t.common.tourLabel} {review.tour?.titleEn || "—"}</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({review.helpfulCount} {t.common.foundHelpful})</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                {review.pros && <p className="text-sm text-green-700 mt-1"><span className="font-medium">{t.admin.pros}</span> {review.pros}</p>}
                {review.cons && <p className="text-sm text-red-600 mt-1"><span className="font-medium">{t.admin.cons}</span> {review.cons}</p>}
              </div>
              <div className="flex items-center gap-2 ml-4">
                {!review.isApproved && (
                  <button onClick={() => handleApprove(review.id, true)} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                    {t.common.approve}
                  </button>
                )}
                {review.isApproved && (
                  <button onClick={() => handleApprove(review.id, false)} className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm rounded-lg hover:bg-yellow-200 transition-colors">
                    {t.common.reject || "Reject"}
                  </button>
                )}
                <button onClick={() => handleDelete(review.id)} className="px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors">
                  {t.common.delete}
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && reviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            {t.admin.noReviews || "No reviews found"}
          </div>
        )}
      </div>
    </div>
  );
}
