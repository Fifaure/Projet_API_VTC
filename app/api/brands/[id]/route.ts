import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const model = await prisma.model.findUnique({
      where: { id: params.id },
      include: {
        vehicles: {
          select: {
            id: true,
            sellerId: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    return NextResponse.json({ data: model })
  } catch (error) {
    console.error('[model.GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await request.json()
    const { name, brand, yearStart, yearEnd } = payload ?? {}

    const model = await prisma.model.update({
      where: { id: params.id },
      data: {
        name,
        brand,
        yearStart: yearStart ?? null,
        yearEnd: yearEnd ?? null
      }
    })

    return NextResponse.json({ data: model })
  } catch (error) {
    console.error('[model.PUT]', error)

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.model.delete({
      where: { id: params.id }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('[model.DELETE]', error)

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    )
  }
}

