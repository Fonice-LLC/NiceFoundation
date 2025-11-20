import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SalonService from '@/models/SalonService';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const services = await SalonService.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch salon services',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const service = await SalonService.create(body);

    return NextResponse.json(
      {
        success: true,
        data: service,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create salon service',
      },
      { status: 500 }
    );
  }
}
