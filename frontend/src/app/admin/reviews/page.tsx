"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";

const reviews = [
  { id: "1", user: "John S.", tour: "Damavand Summit", rating: 5, title: "Life-changing experience!", comment: "Summiting Damavand was incredible...", date: "2025-07-15", verified: true, approved: true, helpful: 12 },
  { id: "2", user: "Maria G.", tour: "Damavand Summit", rating: 5, title: "Amazing adventure", comment: "Well organized trip with professional guides...", date: "2025-06-25", verified: true, approved: true, helpful: 8 },
  { id: "3", user: "Ahmed A.", tour: "Lut Desert", rating: 5, title: "Desert magic", comment: "Sleeping under the stars was magical...", date: "2025-10-20", verified: true, approved: true, helpful: 10 },
  { id: "4", user: "Ali A.", tour: "Isfahan Tour", rating: 4, title: "Great cultural tour", comment: "Wonderful experience exploring Isfahan...", date: "2025-11-05", verified: true, approved: false, helpful: 6 },
];

export default function AdminReviewsPage() {
  const { t } = useI18n();
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved">("all");
  const filteredReviews = filterStatus === "all" ? reviews : reviews.filter((r) => filterStatus === "approved" ? r.approved : !r.approved);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">{t.admin.reviewsManagement}</h1><p className="text-gray-500 mt-1">{reviews.length} {t.common.totalReviews}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((status) => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t.common[status] || status.charAt(0).toUpperCase() + status.slice(1)} ({status === "all" ? reviews.length : reviews.filter((r) => status === "approved" ? r.approved : !r.approved).length})
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-xl shadow-sm border p-6 ${review.approved ? "border-gray-100" : "border-amber-200 bg-amber-50/30"}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{review.user}</span>
                  {review.verified && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{t.common.verified}</span>}
                  {!review.approved && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">{t.common.pendingApproval}</span>}
                  <span className="text-sm text-gray-400">&bull;</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{t.common.tourLabel} {review.tour}</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({review.helpful} {t.common.foundHelpful})</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {!review.approved && <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">{t.common.approve}</button>}
                <button className="px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors">{t.common.delete}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
