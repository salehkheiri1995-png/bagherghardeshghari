interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email not configured - skipping:", data.subject);
    return true;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@visitiran.com",
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export function bookingConfirmationEmail(booking: {
  guestName?: string | null;
  guestEmail?: string | null;
  tourName: string;
  startDate?: string;
  endDate?: string;
  numberOfGuests: number;
  finalPrice: number;
  currency: string;
  bookingId: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #0d9488); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .label { color: #6b7280; }
        .value { font-weight: 600; }
        .total { font-size: 20px; color: #059669; font-weight: bold; }
        .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
          <p>Thank you for booking with VisitIran</p>
        </div>
        <div class="content">
          <p>Hello ${booking.guestName || "Traveler"},</p>
          <p>Your tour booking has been confirmed. Here are the details:</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="label">Booking ID</span>
              <span class="value">#${booking.bookingId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Tour</span>
              <span class="value">${booking.tourName}</span>
            </div>
            ${booking.startDate ? `<div class="detail-row">
              <span class="label">Date</span>
              <span class="value">${booking.startDate} - ${booking.endDate || "TBD"}</span>
            </div>` : ""}
            <div class="detail-row">
              <span class="label">Guests</span>
              <span class="value">${booking.numberOfGuests}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Paid</span>
              <span class="value total">$${booking.finalPrice} ${booking.currency}</span>
            </div>
          </div>

          <p>We will send you more details about your trip closer to the departure date.</p>

          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/bookings" class="btn">View My Bookings</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} VisitIran. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
