import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export const runtime = 'edge'

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      orderBy: { name: 'asc' },
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

    return NextResponse.json({ data: models })
  } catch (error) {
    console.error('[models.GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { name, brand, yearStart, yearEnd } = payload ?? {}

    if (!name || !brand) {
      return NextResponse.json(
        { error: '`name` and `brand` are required' },
        { status: 400 }
      )
    }

    const model = await prisma.model.create({
      data: {
        name,
        brand,
        yearStart: yearStart ?? null,
        yearEnd: yearEnd ?? null
      }
    })

    return NextResponse.json({ data: model }, { status: 201 })
  } catch (error) {
    console.error('[models.POST]', error)
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    )
  }
}

