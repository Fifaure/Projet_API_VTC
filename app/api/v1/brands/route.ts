import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'List brands endpoint not implemented yet.',
  });
}

export async function POST() {
  return NextResponse.json(
    { message: 'Create brand endpoint not implemented yet.' },
    { status: 501 },
  );
}


