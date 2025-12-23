import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SalonService from "@/models/SalonService";
import { getCurrentUser } from "@/lib/auth";

// DELETE /api/admin/services/[serviceId] - Delete a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
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

    const { serviceId } = await params;

    // Delete the service
    const deletedService = await SalonService.findByIdAndDelete(serviceId);

    if (!deletedService) {
      return NextResponse.json(
        {
          success: false,
          error: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete service error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete service",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/services/[serviceId] - Update a service
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
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

    const { serviceId } = await params;
    const body = await request.json();

    // Update the service
    const updatedService = await SalonService.findByIdAndUpdate(
      serviceId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        {
          success: false,
          error: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedService,
      message: "Service updated successfully",
    });
  } catch (error: any) {
    console.error("Update service error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update service",
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/services/[serviceId] - Get a single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
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

    const { serviceId } = await params;

    const service = await SalonService.findById(serviceId);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    console.error("Get service error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch service",
      },
      { status: 500 }
    );
  }
}

