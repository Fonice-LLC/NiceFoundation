import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SalonService from "@/models/SalonService";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/services - Get all salon services
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
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "1000");

    let query: any = {};
    if (category) {
      query.category = category;
    }
    if (featured !== null && featured !== undefined) {
      query.featured = featured === "true";
    }

    const skip = (page - 1) * limit;
    const total = await SalonService.countDocuments(query);

    const services = await SalonService.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        services,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Get services error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/services - Create a new salon service
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate required fields
    const { name, description, category, price, duration } = body;
    if (!name || !description || !category || price === undefined || !duration) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Create the service
    const service = await SalonService.create(body);

    return NextResponse.json(
      {
        success: true,
        data: service,
        message: "Service created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create service error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create service",
      },
      { status: 500 }
    );
  }
}

