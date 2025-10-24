import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In production, this would fetch live stats from your backend
    // For now, return empty array to prevent errors
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching live stats:', error);
    return NextResponse.json({ error: 'Failed to fetch live stats' }, { status: 500 });
  }
}
