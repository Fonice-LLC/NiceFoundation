import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SalonBooking from "@/models/SalonBooking";
import SalonService from "@/models/SalonService";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let query: any = {};

    if (userId) {
      query.user = userId;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await SalonBooking.find(query)
      .sort({ date: -1 })
      .populate("service", "name category duration")
      .lean();

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Check if time slot is available
    const existingBooking = await SalonBooking.findOne({
      date: new Date(body.date),
      time: body.time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "This time slot is already booked",
        },
        { status: 400 }
      );
    }

    // Get the service details for the email
    const service = await SalonService.findById(body.service);
    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: "Service not found",
        },
        { status: 404 }
      );
    }

    const createdBooking = await SalonBooking.create(body);
    const booking = Array.isArray(createdBooking)
      ? createdBooking[0]
      : createdBooking;

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail({
        bookingId: booking._id.toString(),
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        service: {
          name: service.name,
          category: service.category,
          duration: service.duration,
        },
        date: booking.date,
        time: booking.time,
        totalPrice: booking.totalPrice,
        notes: booking.notes,
        status: booking.status,
      });
      console.log("Booking confirmation email sent successfully");
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json(
      {
        success: true,
        data: booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create booking",
      },
      { status: 500 }
    );
  }
}
