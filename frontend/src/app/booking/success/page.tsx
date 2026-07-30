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

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const { t, formatCurrency } = useI18n();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (sessionId) {
          const res = await fetch(`/api/payment/verify?session_id=${sessionId}`);
          const data = await res.json();
          if (data.success && data.data.booking) {
            setBooking(data.data.booking);
          } else {
            setError(data.error || "Payment verification failed");
          }
        } else if (bookingId) {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/bookings?limit=50`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const data = await res.json();
          if (data.success) {
            const found = data.data.find((b: BookingData) => b.id === bookingId);
            if (found) {
              setBooking(found);
            } else {
              setError("Booking not found");
            }
          } else {
            setError("Failed to load booking");
          }
        } else {
          setError("No session or booking found");
        }
      } catch {
        setError("Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600">{t.common.loading}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md w-full text-center px-4">
          {error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.common.error}</h1>
              <p className="text-gray-600 mb-6">{error}</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.booking.bookingConfirmed}</h1>
              <p className="text-gray-600 mb-6">{t.common.success}</p>

              {booking && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-gray-500">{t.dashboard.myBookings}</p>
                  <p className="font-semibold text-gray-900">{booking.tour.titleEn || booking.tour.title}</p>
                  <p className="text-sm text-gray-600">{booking.numberOfGuests} {t.booking.totalGuests}</p>
                  <p className="text-lg font-bold text-emerald-600 mt-2">
                    {formatCurrency(booking.finalPrice)}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-3">
            <Link href="/dashboard/bookings" className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
              {t.dashboard.myBookings}
            </Link>
            <Link href="/tours" className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              {t.common.viewAll} {t.common.tours}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BookingSuccessPage() {
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
      <BookingSuccessContent />
    </Suspense>
  );
}
