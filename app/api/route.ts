import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API root. Available namespaces: v1.',
  });
}


