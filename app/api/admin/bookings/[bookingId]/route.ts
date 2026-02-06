import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SalonBooking from "@/models/SalonBooking";
import { getCurrentUser } from "@/lib/auth";

// DELETE /api/admin/bookings/[bookingId] - Delete a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    await connectDB();

    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 403 }
      );
    }

    const { bookingId } = await params;

    // Delete the booking
    const deletedBooking = await SalonBooking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete booking",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/bookings/[bookingId] - Update a booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    await connectDB();

    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 403 }
      );
    }

    const { bookingId } = await params;
    const body = await request.json();

    // Update the booking
    const updatedBooking = await SalonBooking.findByIdAndUpdate(
      bookingId,
      { $set: body },
      { new: true, runValidators: true }
    ).populate("service", "name category duration price");

    if (!updatedBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error: any) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update booking",
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/bookings/[bookingId] - Get a single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    await connectDB();

    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 403 }
      );
    }

    const { bookingId } = await params;

    const booking = await SalonBooking.findById(bookingId)
      .populate("service", "name category duration price")
      .populate("user", "name email");

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch booking",
      },
      { status: 500 }
    );
  }
}

