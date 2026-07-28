"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useI18n } from "@/context/I18nContext";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="text-center px-4">
          <h1 className="text-8xl font-bold text-emerald-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.common.error}</h2>
          <p className="text-gray-600 mb-8">{t.common.backToHome}</p>
          <Link href="/" className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
            {t.common.backToHome}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
