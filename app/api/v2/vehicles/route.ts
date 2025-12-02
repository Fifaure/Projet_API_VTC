import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { Prisma } from '@/app/generated/prisma/client'
import { requireAuth } from '@/app/lib/authMiddleware'

const vehicleInclude = { model: true, seller: true } as const

type VehicleWithRelations = Prisma.VehicleGetPayload<{ include: typeof vehicleInclude }>

const serializeVehicle = (vehicle: VehicleWithRelations) => ({
  ...vehicle,
  priceEUR: vehicle.priceEUR ? vehicle.priceEUR.toString() : null
})

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const where: Prisma.VehicleWhereInput = {}

    const modelId = searchParams.get('modelId')
    if (modelId) where.modelId = modelId

    const sellerId = searchParams.get('sellerId')
    if (sellerId) where.sellerId = sellerId

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: vehicleInclude,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ data: vehicles.map(serializeVehicle) })
  } catch {
    return NextResponse.json(
      { error: 'Impossible de récupérer les véhicules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (!auth.authenticated) return auth.response

  try {
    const body = await request.json()

    const modelId = body?.modelId?.toString().trim()
    if (!modelId) {
      return NextResponse.json({ error: 'modelId est obligatoire' }, { status: 400 })
    }

    const rawSellerId = body?.sellerId
    const sellerId = rawSellerId === null || rawSellerId === undefined
      ? undefined
      : rawSellerId === '' ? null : rawSellerId.toString().trim()

    let mileageKm: number | null | undefined = undefined
    if (body?.mileageKm !== undefined) {
      if (body.mileageKm === null || body.mileageKm === '') {
        mileageKm = null
      } else {
        const parsed = Number.parseInt(body.mileageKm, 10)
        if (Number.isNaN(parsed)) {
          return NextResponse.json({ error: 'mileageKm doit être un entier' }, { status: 400 })
        }
        mileageKm = parsed
      }
    }

    let priceEUR: Prisma.Decimal | null | undefined = undefined
    if (body?.priceEUR !== undefined) {
      if (body.priceEUR === null || body.priceEUR === '') {
        priceEUR = null
      } else {
        const priceString = body.priceEUR.toString()
        if (!priceString || Number.isNaN(Number(priceString))) {
          return NextResponse.json({ error: 'priceEUR doit être un nombre' }, { status: 400 })
        }
        try {
          priceEUR = new Prisma.Decimal(priceString)
        } catch {
          return NextResponse.json({ error: 'priceEUR doit être un nombre décimal valide' }, { status: 400 })
        }
      }
    }

    const color = body?.color === undefined ? undefined : body.color === null ? null : body.color.toString().trim() || null
    const notes = body?.notes === undefined ? undefined : body.notes === null ? null : body.notes.toString().trim() || null

    const vehicle = await prisma.vehicle.create({
      data: {
        modelId,
        sellerId: sellerId === undefined ? undefined : sellerId === null ? null : sellerId,
        mileageKm,
        priceEUR,
        color,
        notes
      },
      include: vehicleInclude
    })

    return NextResponse.json({ data: serializeVehicle(vehicle) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Impossible de créer le véhicule' }, { status: 500 })
  }
}
