import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In production, this would fetch from your PostgreSQL database
    // For now, return a basic response to prevent errors
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
