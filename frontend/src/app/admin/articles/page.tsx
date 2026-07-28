"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

interface ArticleItem {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
  author: { name: string } | null;
}

const categoryLabels: Record<string, string> = {
  TRAVEL_GUIDE: "Travel Guide",
  FOOD: "Food",
  CULTURE: "Culture",
  ADVENTURE: "Adventure",
  NEWS: "News",
};

export default function AdminArticlesPage() {
  const { t } = useI18n();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "fa">("en");
  const [formData, setFormData] = useState({
    title: "", titleEn: "", titleFa: "",
    content: "", contentEn: "", contentFa: "",
    excerpt: "", excerptEn: "", excerptFa: "",
    category: "TRAVEL_GUIDE",
  });

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/articles?limit=50", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setActiveTab("en");
    setFormData({ title: "", titleEn: "", titleFa: "", content: "", contentEn: "", contentFa: "", excerpt: "", excerptEn: "", excerptFa: "", category: "TRAVEL_GUIDE" });
    setShowModal(true);
  };

  const openEditModal = (article: ArticleItem) => {
    setEditingArticle(article);
    setActiveTab("en");
    setFormData({
      title: article.title, titleEn: article.titleEn, titleFa: "",
      content: "", contentEn: "", contentFa: "",
      excerpt: "", excerptEn: "", excerptFa: "",
      category: article.category,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      ...(editingArticle ? { articleId: editingArticle.id } : {}),
      title: formData.titleFa || formData.titleEn,
      titleEn: formData.titleEn,
      titleFa: formData.titleFa,
      content: formData.contentFa || formData.content,
      contentEn: formData.contentEn,
      contentFa: formData.contentFa,
      excerpt: formData.excerptFa || formData.excerpt,
      excerptEn: formData.excerptEn,
      excerptFa: formData.excerptFa,
      category: formData.category,
    };

    try {
      const method = editingArticle ? "PUT" : "POST";
      const res = await fetch("/api/admin/articles", {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchArticles();
      } else {
        alert(data.error || "Failed to save article");
      }
    } catch (err) {
      console.error("Save article error:", err);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/articles?articleId=${articleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchArticles();
    } catch (err) {
      console.error("Delete article error:", err);
    }
  };

  const handleTogglePublish = async (article: ArticleItem) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ articleId: article.id, isPublished: !article.isPublished }),
      });
      const data = await res.json();
      if (data.success) fetchArticles();
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.articlesManagement}</h1>
          <p className="text-gray-500 mt-1">{articles.length} {t.admin.totalArticles || "articles"}</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          {t.admin.addArticle || "Add Article"}
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
                  <th className="px-6 py-3">{t.common.title || "Title"}</th>
                  <th className="px-6 py-3">{t.common.type}</th>
                  <th className="px-6 py-3">{t.common.author || "Author"}</th>
                  <th className="px-6 py-3">{t.common.views || "Views"}</th>
                  <th className="px-6 py-3">{t.common.status}</th>
                  <th className="px-6 py-3">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{article.titleEn}</p>
                      <p className="text-xs text-gray-400">{new Date(article.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium">{categoryLabels[article.category] || article.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{article.author?.name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{article.views}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${article.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {article.isPublished ? t.common.published || "Published" : t.common.draft || "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(article)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(article.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">{t.admin.noArticles || "No articles found"}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">{editingArticle ? t.admin.editArticle || "Edit Article" : t.admin.addArticle || "Add Article"}</h2>
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
                    <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (English)</label>
                    <textarea name="excerptEn" value={formData.excerptEn} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
                    <textarea name="contentEn" value={formData.contentEn} onChange={handleChange} rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">عنوان (فارسی)</label>
                    <input type="text" name="titleFa" value={formData.titleFa} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">خلاصه (فارسی)</label>
                    <textarea name="excerptFa" value={formData.excerptFa} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">محتوا (فارسی)</label>
                    <textarea name="contentFa" value={formData.contentFa} onChange={handleChange} rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none" dir="rtl" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.type}</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">{t.common.cancel}</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                {editingArticle ? t.admin.updateArticle || "Update Article" : t.admin.createArticle || "Create Article"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
