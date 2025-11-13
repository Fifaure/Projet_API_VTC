import { NextResponse } from 'next/server';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  return NextResponse.json({
    message: `Fetch brand ${params.id} endpoint not implemented yet.`,
  });
}

export async function PATCH(_: Request, { params }: Params) {
  return NextResponse.json(
    { message: `Update brand ${params.id} endpoint not implemented yet.` },
    { status: 501 },
  );
}

export async function DELETE(_: Request, { params }: Params) {
  return NextResponse.json(
    { message: `Delete brand ${params.id} endpoint not implemented yet.` },
    { status: 501 },
  );
}


