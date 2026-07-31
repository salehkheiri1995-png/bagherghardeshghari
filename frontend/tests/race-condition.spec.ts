import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// These credentials must exist in the database (from seed)
const USER_EMAIL = "john@example.com";
const USER_PASSWORD = "Password123!";

async function login(request: any): Promise<string> {
  const res = await request.post(`${BASE_URL}/api/auth/login`, {
    data: { email: USER_EMAIL, password: USER_PASSWORD },
  });
  const body = await res.json();
  return body.data.token;
}

test.describe("Booking race condition", () => {
  test("two concurrent bookings for last spot — only one succeeds", async ({ request }) => {
    const token = await login(request);
    const authHeader = { Authorization: `Bearer ${token}` };

    // Find a tour date with very limited spots (1 remaining)
    // We create a scenario by picking a tourDate with small availableSpots
    const toursRes = await request.get(`${BASE_URL}/api/tours`, {
      headers: authHeader,
    });
    const toursBody = await toursRes.json();
    const tour = toursBody.data.find((t: any) => t.slug === "masuleh-kandovan-villages");
    expect(tour).toBeTruthy();

    // Get tour detail to find a date with limited spots
    const detailRes = await request.get(`${BASE_URL}/api/tours/${tour.slug}`, {
      headers: authHeader,
    });
    const detailBody = await detailRes.json();
    const tourDate = detailBody.data.tourDates?.find((d: any) => d.availableSpots >= 2);
    if (!tourDate) {
      test.skip();
      return;
    }

    // Reduce availableSpots to exactly 1 via direct DB call is complex in tests,
    // so we send 2 requests each booking (tourDate.availableSpots) guests at once.
    // The total requested should exceed available spots.
    const guestsPerRequest = Math.ceil(tourDate.availableSpots / 2) + 1;

    const payload = {
      tourId: tour.id,
      tourDateId: tourDate.id,
      numberOfGuests: guestsPerRequest,
      guestName: "Test User",
      guestEmail: "test@example.com",
      guestCountry: "Testland",
    };

    // Fire both requests simultaneously
    const [res1, res2] = await Promise.all([
      request.post(`${BASE_URL}/api/bookings`, {
        headers: authHeader,
        data: payload,
      }),
      request.post(`${BASE_URL}/api/bookings`, {
        headers: authHeader,
        data: payload,
      }),
    ]);

    const body1 = await res1.json();
    const body2 = await res2.json();

    const statuses = [res1.status(), res2.status()].sort();
    const successCount = statuses.filter((s) => s === 201).length;
    const conflictCount = statuses.filter((s) => s === 409).length;

    // Exactly one should succeed (201) and the other should fail (409 Conflict)
    expect(successCount).toBe(1);
    expect(conflictCount).toBe(1);

    // The successful one should have booking data
    const successBody = res1.status() === 201 ? body1 : body2;
    expect(successBody.success).toBe(true);
    expect(successBody.data).toHaveProperty("id");

    // The failed one should have proper error
    const failBody = res1.status() === 409 ? body1 : body2;
    expect(failBody.success).toBe(false);
    expect(failBody.error).toContain("Not enough spots");
  });
});
