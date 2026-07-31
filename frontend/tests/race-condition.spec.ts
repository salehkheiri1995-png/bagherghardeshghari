import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const USER_EMAIL = "john@example.com";
const USER_PASSWORD = "Password123!";

async function getToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: USER_EMAIL, password: USER_PASSWORD }),
  });
  const body = await res.json();
  return body.data.token;
}

async function findTourWithDate(token: string): Promise<{ tour: any; tourDate: any } | null> {
  const headers = { Authorization: `Bearer ${token}` };
  const toursRes = await fetch(`${BASE_URL}/api/tours`, { headers });
  const toursBody = await toursRes.json();
  const tours = toursBody.data || [];

  for (const t of tours) {
    const detailRes = await fetch(`${BASE_URL}/api/tours/${t.slug}`, { headers });
    const detail = await detailRes.json();
    const dates = detail.data?.tourDates;
    if (dates && dates.length > 0) {
      return { tour: { id: t.id, slug: t.slug }, tourDate: dates[0] };
    }
  }
  return null;
}

test.describe("Booking race condition", () => {
  test("two truly concurrent bookings — only one succeeds", async () => {
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const found = await findTourWithDate(token);
    if (!found) {
      test.skip(true, "No tour with future dates found");
      return;
    }
    const { tour, tourDate } = found;

    // Set spots to exactly 1
    await fetch(`${BASE_URL}/api/test/set-spots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tourDateId: tourDate.id, spots: 1 }),
    });

    const payload = JSON.stringify({
      tourId: tour.id,
      tourDateId: tourDate.id,
      numberOfGuests: 1,
      guestName: "Test User",
      guestEmail: "test@example.com",
      guestCountry: "Testland",
    });

    // Two truly concurrent requests via raw fetch (not Playwright request API)
    const [res1, res2] = await Promise.all([
      fetch(`${BASE_URL}/api/bookings`, { method: "POST", headers, body: payload }),
      fetch(`${BASE_URL}/api/bookings`, { method: "POST", headers, body: payload }),
    ]);

    const [body1, body2] = await Promise.all([res1.json(), res2.json()]);

    const successCount = [res1.status, res2.status].filter((s) => s === 201).length;
    const conflictCount = [res1.status, res2.status].filter((s) => s === 409).length;

    expect(successCount).toBe(1);
    expect(conflictCount).toBe(1);

    const failBody = res1.status === 409 ? body1 : body2;
    expect(failBody.error).toContain("Not enough spots");
  });

  test("normal booking reduces spots correctly", async () => {
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const found = await findTourWithDate(token);
    if (!found) {
      test.skip(true, "No tour with future dates found");
      return;
    }
    const { tour, tourDate } = found;

    // Set spots to 5
    await fetch(`${BASE_URL}/api/test/set-spots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tourDateId: tourDate.id, spots: 5 }),
    });

    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        tourId: tour.id,
        tourDateId: tourDate.id,
        numberOfGuests: 2,
        guestName: "Test User",
        guestEmail: "test@example.com",
        guestCountry: "Testland",
      }),
    });
    expect(res.status).toBe(201);

    // Verify spots reduced to 3
    const detailRes = await fetch(`${BASE_URL}/api/tours/${tour.slug}`, { headers });
    const detail = await detailRes.json();
    const updatedDate = detail.data?.tourDates?.find((d: any) => d.id === tourDate.id);
    expect(updatedDate?.availableSpots).toBe(3);
  });

  test("booking more than available spots returns 409", async () => {
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const found = await findTourWithDate(token);
    if (!found) {
      test.skip(true, "No tour with future dates found");
      return;
    }
    const { tour, tourDate } = found;

    // Set spots to 1
    await fetch(`${BASE_URL}/api/test/set-spots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tourDateId: tourDate.id, spots: 1 }),
    });

    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        tourId: tour.id,
        tourDateId: tourDate.id,
        numberOfGuests: 5,
        guestName: "Test User",
        guestEmail: "test@example.com",
        guestCountry: "Testland",
      }),
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toContain("Not enough spots");
  });
});
