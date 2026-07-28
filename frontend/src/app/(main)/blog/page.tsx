"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEOHead";
import { useI18n } from "@/context/I18nContext";

const articles = [
  { id: "1", title: "Complete Guide to Traveling in Iran", slug: "complete-guide-traveling-iran", category: "TRAVEL_GUIDE", author: "Admin", date: "Dec 1, 2025", views: 2450 },
  { id: "2", title: "10 Foods You Must Try in Iran", slug: "10-must-try-foods-iran", category: "FOOD", author: "Admin", date: "Nov 15, 2025", views: 1890 },
  { id: "3", title: "Best Time to Visit Iran", slug: "best-time-visit-iran", category: "TRAVEL_GUIDE", author: "Admin", date: "Oct 20, 2025", views: 1560 },
  { id: "4", title: "Iranian Customs and Etiquette", slug: "iranian-customs-etiquette", category: "CULTURE", author: "Admin", date: "Sep 10, 2025", views: 980 },
];

const categoryColors: Record<string, string> = {
  TRAVEL_GUIDE: "bg-emerald-100 text-emerald-700",
  FOOD: "bg-orange-100 text-orange-700",
  CULTURE: "bg-purple-100 text-purple-700",
  NEWS: "bg-blue-100 text-blue-700",
  TIPS: "bg-yellow-100 text-yellow-700",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { t } = useI18n();

  const categories = ["All", t.tours.city, t.tours.forest, t.about.ourValues, t.home.learnMore];

  const filteredArticles = activeCategory === "All"
    ? articles
    : articles.filter((a) => a.category.replace("_", " ") === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={t.common.blog} description={t.home.testimonialsDesc} />
      <Header />
      <main className="flex-1 bg-gray-50">
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.common.blog}</h1>
            <p className="text-xl text-emerald-100">{t.home.testimonialsDesc}</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-500 relative">
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>
                    {article.category.replace("_", " ")}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">{article.title}</h2>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.author} &bull; {article.date}</span>
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
