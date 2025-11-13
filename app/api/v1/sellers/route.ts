import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'List sellers endpoint not implemented yet.',
  });
}

export async function POST() {
  return NextResponse.json(
    { message: 'Create seller endpoint not implemented yet.' },
    { status: 501 },
  );
}


