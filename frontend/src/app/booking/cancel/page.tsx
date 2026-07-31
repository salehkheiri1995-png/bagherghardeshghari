"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useI18n } from "@/context/I18nContext";

interface BookingData {
  id: string;
  status: string;
  tour: { titleEn: string; title: string; slug: string };
  numberOfGuests: number;
  finalPrice: number;
  currency: string;
}

function BookingCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const tourSlug = searchParams.get("tour");
  const { t, formatCurrency } = useI18n();
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/bookings?limit=50`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((b: BookingData) => b.id === bookingId);
          if (found) setBooking(found);
        }
      } catch {
        // silently ignore
      }
    };

    fetchBooking();
  }, [bookingId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md w-full text-center px-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.common.cancel}</h1>
          <p className="text-gray-600 mb-6">
            {t.booking.cancelBooking} — {t.common.error}
          </p>

          {booking && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-500">{t.dashboard.myBookings}</p>
              <p className="font-semibold text-gray-900">{booking.tour.titleEn || booking.tour.title}</p>
              <p className="text-sm text-gray-600">{booking.numberOfGuests} {t.booking.totalGuests}</p>
              <p className="text-sm text-yellow-600 mt-2 font-medium">{t.booking.cancelBooking}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href={tourSlug ? `/tours/${tourSlug}` : "/tours"}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {t.common.viewAll} {t.common.tours}
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.common.home}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BookingCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
        </main>
        <Footer />
      </div>
    }>
      <BookingCancelContent />
    </Suspense>
  );
}
