"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEOHead";
import { useI18n } from "@/context/I18nContext";

interface Article {
  id: string; title: string; titleEn: string; slug: string; category: string;
  image: string | null; views: number; publishedAt: string | null; excerpt: string | null; excerptEn: string | null;
  author: { name: string } | null;
}

const categoryColors: Record<string, string> = {
  TRAVEL_GUIDE: "bg-emerald-100 text-emerald-700",
  FOOD: "bg-orange-100 text-orange-700",
  CULTURE: "bg-purple-100 text-purple-700",
  NEWS: "bg-blue-100 text-blue-700",
  TIPS: "bg-yellow-100 text-yellow-700",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { t, locale } = useI18n();
  const isFa = locale === "fa";
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "TRAVEL_GUIDE", "FOOD", "CULTURE", "NEWS", "TIPS"];

  const categoryLabels: Record<string, string> = {
    TRAVEL_GUIDE: isFa ? "راهنمای سفر" : "Travel Guide",
    FOOD: isFa ? "غذا" : "Food",
    CULTURE: isFa ? "فرهنگ" : "Culture",
    NEWS: isFa ? "اخبار" : "News",
    TIPS: isFa ? "نکات" : "Tips",
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "All") params.set("category", activeCategory);
    fetch(`/api/articles?${params}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setArticles(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={t.common.blog} description={isFa ? "مقاله‌ها و راهنماهای سفر" : "Travel articles and guides"} />
      <Header />
      <main className="flex-1 bg-gray-50">
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.common.blog}</h1>
            <p className="text-xl text-emerald-100">{isFa ? "مقاله‌ها و راهنماهای سفر" : "Travel articles and guides"}</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                {cat === "All" ? (isFa ? "همه" : "All") : categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 relative overflow-hidden">
                    {article.image ? (
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                    )}
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>
                      {categoryLabels[article.category] || article.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">{isFa ? article.title : article.titleEn}</h2>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{isFa ? article.excerpt : article.excerptEn || article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.author?.name || "Admin"} &bull; {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}</span>
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}

              {articles.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">{isFa ? "مقاله‌ای یافت نشد" : "No articles found"}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
