import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SalonBooking from '@/models/SalonBooking';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query: any = {};

    if (userId) {
      query.user = userId;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await SalonBooking.find(query)
      .sort({ date: -1 })
      .populate('service', 'name category duration')
      .lean();

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch bookings',
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
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: 'This time slot is already booked',
        },
        { status: 400 }
      );
    }

    const booking = await SalonBooking.create(body);

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
        error: error.message || 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}
