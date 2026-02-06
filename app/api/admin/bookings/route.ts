import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SalonBooking from "@/models/SalonBooking";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/bookings - Get all bookings
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "1000");

    let query: any = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await SalonBooking.countDocuments(query);

    // Get all bookings with service details
    const bookings = await SalonBooking.find(query)
      .populate("service", "name category duration price")
      .populate("user", "name email")
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}

