/**
 * Tour statistics synchronization utilities.
 *
 * Use these after creating/updating reviews or bookings to keep
 * aggregate stats on the Tour model in sync.
 *
 * These are designed to be called from API routes (server-side only).
 */

import prisma from "./prisma";

/**
 * Recalculate a tour's averageRating and totalReviews from all approved reviews.
 */
export async function syncTourRatingStats(tourId: string): Promise<void> {
  try {
    const stats = await prisma.review.aggregate({
      where: {
        tourId,
        isApproved: true,
      },
      _avg: { rating: true },
      _count: { id: true },
    });

    const avgRating = stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0;
    const totalReviews = stats._count.id;

    await prisma.tour.update({
      where: { id: tourId },
      data: {
        averageRating: avgRating,
        totalReviews,
      },
    });
  } catch (error) {
    console.error(`Failed to sync rating stats for tour ${tourId}:`, error);
  }
}

/**
 * Recalculate a tour's totalBookings from all non-cancelled bookings.
 */
export async function syncTourBookingStats(tourId: string): Promise<void> {
  try {
    const totalBookings = await prisma.booking.count({
      where: {
        tourId,
        status: { not: "CANCELLED" },
      },
    });

    await prisma.tour.update({
      where: { id: tourId },
      data: { totalBookings },
    });
  } catch (error) {
    console.error(`Failed to sync booking stats for tour ${tourId}:`, error);
  }
}
