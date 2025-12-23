import nodemailer from "nodemailer";

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
const FROM_NAME = process.env.FROM_NAME || "Planet Beauty";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Format date helper
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

interface OrderItem {
  product: {
    name: string;
    brand: string;
    price: number;
    salePrice?: number;
    images?: string[];
  };
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  orderDate: Date;
  paymentMethod: string;
  shippingAddress?: ShippingAddress;
}

// Generate receipt email HTML
const generateReceiptHTML = (data: OrderEmailData): string => {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          ${
            item.product.images && item.product.images.length > 0
              ? `<img src="${item.product.images[0]}" alt="${item.product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;" />`
              : ""
          }
          <div>
            <div style="font-weight: 600; color: #333; margin-bottom: 4px;">${
              item.product.name
            }</div>
            <div style="color: #666; font-size: 14px;">${
              item.product.brand
            }</div>
            <div style="color: #666; font-size: 14px;">Quantity: ${
              item.quantity
            }</div>
          </div>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">
        ${formatPrice(item.price)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Order Confirmation - Planet Beauty</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Planet Beauty</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Thank you for your order!</p>
            </td>
          </tr>
          
          <!-- Order Confirmation -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 16px;">
                  ✓ Order Confirmed
                </div>
              </div>
              
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Hi ${
                data.customerName
              },</h2>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                We've received your order and it's being processed. You'll receive another email when your order ships.
              </p>
              
              <!-- Order Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <strong style="color: #333;">Order Number:</strong>
                      <span style="color: #666;">#${data.orderId
                        .slice(-8)
                        .toUpperCase()}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <strong style="color: #333;">Order Date:</strong>
                      <span style="color: #666;">${formatDate(
                        data.orderDate
                      )}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong style="color: #333;">Payment Method:</strong>
                      <span style="color: #666;">${
                        data.paymentMethod === "card"
                          ? "Credit/Debit Card"
                          : data.paymentMethod
                      }</span>
                    </td>
                  </tr>
                </table>
              </div>

              ${
                data.shippingAddress
                  ? `
              <!-- Shipping Address -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Shipping Address</h3>
                <div style="color: #666; line-height: 1.8;">
                  <div style="font-weight: 600; color: #333;">${
                    data.shippingAddress.fullName
                  }</div>
                  <div>${data.shippingAddress.addressLine1}</div>
                  ${
                    data.shippingAddress.addressLine2
                      ? `<div>${data.shippingAddress.addressLine2}</div>`
                      : ""
                  }
                  <div>${data.shippingAddress.city}, ${
                      data.shippingAddress.state
                    } ${data.shippingAddress.zipCode}</div>
                  <div>${data.shippingAddress.country}</div>
                  <div style="margin-top: 10px;">
                    <strong style="color: #333;">Phone:</strong> ${
                      data.shippingAddress.phone
                    }
                  </div>
                </div>
              </div>
              `
                  : ""
              }

              <!-- Order Items -->
              <h3 style="margin: 30px 0 15px 0; color: #333; font-size: 20px;">Order Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                ${itemsHTML}

                <!-- Total -->
                <tr>
                  <td colspan="2" style="padding: 20px; background-color: #f9fafb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: right; padding: 5px 0;">
                          <strong style="font-size: 18px; color: #333;">Total:</strong>
                        </td>
                        <td style="text-align: right; padding: 5px 0; width: 120px;">
                          <strong style="font-size: 18px; color: #ec4899;">${formatPrice(
                            data.total
                          )}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Support -->
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                  Questions about your order? We're here to help!
                </p>
                <p style="margin: 0; color: #666; font-size: 14px;">
                  Email us at <a href="mailto:support@planetbeauty.com" style="color: #ec4899; text-decoration: none;">support@planetbeauty.com</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Planet Beauty. All rights reserved.
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                This email was sent to ${data.customerEmail}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Send order confirmation email
export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<boolean> {
  try {
    // Validate SMTP configuration
    if (!SMTP_USER || !SMTP_PASS) {
      console.error("SMTP credentials not configured");
      return false;
    }

    const transporter = createTransporter();

    // Generate email content
    const html = generateReceiptHTML(data);

    // Send email with proper headers to avoid spam
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: data.customerEmail,
      replyTo: FROM_EMAIL,
      subject: `Order Confirmation - #${data.orderId.slice(-8).toUpperCase()}`,
      html,
      text: `Thank you for your order! Order #${data.orderId
        .slice(-8)
        .toUpperCase()} has been confirmed. Total: $${data.total.toFixed(2)}`,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
        "X-Mailer": "Planet Beauty Order System",
      },
    });

    console.log("Order confirmation email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return false;
  }
}

// Format date for booking
const formatBookingDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

interface BookingEmailData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: {
    name: string;
    category: string;
    duration: number;
  };
  date: Date;
  time: string;
  totalPrice: number;
  notes?: string;
  status: string;
}

// Send booking confirmation email
export async function sendBookingConfirmationEmail(
  bookingData: BookingEmailData
): Promise<boolean> {
  try {
    if (!SMTP_USER || !SMTP_PASS) {
      console.error("SMTP credentials not configured");
      return false;
    }

    const transporter = createTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 30px; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Planet Beauty Salon</h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Booking Confirmation</p>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding: 30px 30px 20px 30px;">
                      <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 24px;">Hello ${
                        bookingData.customerName
                      }!</h2>
                      <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Thank you for booking with Planet Beauty Salon. Your appointment has been confirmed!
                      </p>
                    </td>
                  </tr>

                  <!-- Booking Details -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Appointment Details</h3>

                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Booking ID:</td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">#${bookingData.bookingId
                                  .slice(-8)
                                  .toUpperCase()}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Service:</td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${
                                  bookingData.service.name
                                }</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Category:</td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px; text-transform: capitalize;">${
                                  bookingData.service.category
                                }</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date:</td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${formatBookingDate(
                                  bookingData.date
                                )}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time:</td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${
                                  bookingData.time
                                }</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Duration:</td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px;">${
                                  bookingData.service.duration
                                } minutes</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
                                <td style="padding: 8px 0;">
                                  <span style="display: inline-block; padding: 4px 12px; background-color: #fef3c7; color: #92400e; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                                    ${bookingData.status}
                                  </span>
                                </td>
                              </tr>
                              ${
                                bookingData.notes
                                  ? `
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">Notes:</td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px;">${bookingData.notes}</td>
                              </tr>
                              `
                                  : ""
                              }
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Price -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; border-top: 2px solid #e5e7eb; padding-top: 20px;">
                        <tr>
                          <td style="padding: 10px 0; text-align: right;">
                            <span style="color: #6b7280; font-size: 16px; margin-right: 20px;">Total Price:</span>
                            <span style="color: #ec4899; font-size: 24px; font-weight: bold;">${formatPrice(
                              bookingData.totalPrice
                            )}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Contact Info -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Your Contact Information</p>
                        <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                          Email: ${bookingData.customerEmail}<br>
                          Phone: ${bookingData.customerPhone}
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Important Info -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">Important Information</p>
                        <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                          • Please arrive 10 minutes before your appointment<br>
                          • If you need to reschedule or cancel, please contact us at least 24 hours in advance<br>
                          • We will send you a reminder 24 hours before your appointment
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                        Questions? Contact us at <a href="mailto:${FROM_EMAIL}" style="color: #ec4899; text-decoration: none;">${FROM_EMAIL}</a>
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        © ${new Date().getFullYear()} Planet Beauty Salon. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Plain text version
    const textContent = `
PLANET BEAUTY SALON - BOOKING CONFIRMATION

Hello ${bookingData.customerName}!

Thank you for booking with Planet Beauty Salon. Your appointment has been confirmed!

APPOINTMENT DETAILS:
-------------------
Booking ID: #${bookingData.bookingId.slice(-8).toUpperCase()}
Service: ${bookingData.service.name}
Category: ${bookingData.service.category}
Date: ${formatBookingDate(bookingData.date)}
Time: ${bookingData.time}
Duration: ${bookingData.service.duration} minutes
Status: ${bookingData.status}
${bookingData.notes ? `Notes: ${bookingData.notes}` : ""}

Total Price: ${formatPrice(bookingData.totalPrice)}

YOUR CONTACT INFORMATION:
------------------------
Email: ${bookingData.customerEmail}
Phone: ${bookingData.customerPhone}

IMPORTANT INFORMATION:
---------------------
• Please arrive 10 minutes before your appointment
• If you need to reschedule or cancel, please contact us at least 24 hours in advance
• We will send you a reminder 24 hours before your appointment

Questions? Contact us at ${FROM_EMAIL}

© ${new Date().getFullYear()} Planet Beauty Salon. All rights reserved.
    `;

    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: bookingData.customerEmail,
      replyTo: FROM_EMAIL,
      subject: `Booking Confirmation - ${bookingData.service.name}`,
      text: textContent,
      html: htmlContent,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    });

    console.log("Booking confirmation email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return false;
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    if (!SMTP_USER || !SMTP_PASS) {
      console.error("SMTP credentials not configured");
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log("SMTP configuration is valid");
    return true;
  } catch (error) {
    console.error("SMTP configuration error:", error);
    return false;
  }
}
