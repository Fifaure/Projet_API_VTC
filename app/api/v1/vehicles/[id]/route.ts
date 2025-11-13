import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { Prisma } from '@/app/generated/prisma/client'

type Params = {
  params: {
    id: string
  }
}

const vehicleInclude = {
  model: true,
  seller: true
} as const

type VehicleWithRelations = Prisma.VehicleGetPayload<{
  include: typeof vehicleInclude
}>

const serializeVehicle = (vehicle: VehicleWithRelations) => ({
  ...vehicle,
  priceEUR: vehicle.priceEUR ? vehicle.priceEUR.toString() : null
})

export const runtime = 'nodejs'

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: vehicleInclude
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Véhicule introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: serializeVehicle(vehicle)
    })
  } catch (error) {
    console.error('[vehicles/:id.GET]', error)

    return NextResponse.json(
      { error: 'Impossible de récupérer le véhicule' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()

    const data: Prisma.VehicleUpdateInput = {}

    if (body?.modelId !== undefined) {
      const modelId = body.modelId?.toString().trim()
      if (!modelId) {
        return NextResponse.json(
          { error: 'modelId ne peut pas être vide' },
          { status: 400 }
        )
      }
      data.model = { connect: { id: modelId } }
    }

    if (body?.sellerId !== undefined) {
      const rawSellerId = body.sellerId
      if (rawSellerId === null || rawSellerId === '') {
        data.seller = { disconnect: true }
      } else {
        const sellerId = rawSellerId.toString().trim()
        if (!sellerId) {
          return NextResponse.json(
            { error: 'sellerId ne peut pas être vide' },
            { status: 400 }
          )
        }
        data.seller = { connect: { id: sellerId } }
      }
    }

    if (body?.mileageKm !== undefined) {
      if (body.mileageKm === null || body.mileageKm === '') {
        data.mileageKm = null
      } else {
        const parsedMileage = Number.parseInt(body.mileageKm, 10)
        if (Number.isNaN(parsedMileage)) {
          return NextResponse.json(
            { error: 'mileageKm doit être un entier' },
            { status: 400 }
          )
        }
        data.mileageKm = parsedMileage
      }
    }

    if (body?.priceEUR !== undefined) {
      if (body.priceEUR === null || body.priceEUR === '') {
        data.priceEUR = null
      } else {
        const priceString = body.priceEUR.toString()
        if (!priceString || Number.isNaN(Number(priceString))) {
          return NextResponse.json(
            { error: 'priceEUR doit être un nombre' },
            { status: 400 }
          )
        }
        try {
          data.priceEUR = new Prisma.Decimal(priceString)
        } catch {
          return NextResponse.json(
            { error: 'priceEUR doit être un nombre décimal valide' },
            { status: 400 }
          )
        }
      }
    }

    if (body?.color !== undefined) {
      data.color =
        body.color === null
          ? null
          : body.color.toString().trim() || null
    }

    if (body?.notes !== undefined) {
      data.notes =
        body.notes === null
          ? null
          : body.notes.toString().trim() || null
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Aucun champ fourni pour la mise à jour' },
        { status: 400 }
      )
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data,
      include: vehicleInclude
    })

    return NextResponse.json({
      data: serializeVehicle(vehicle)
    })
  } catch (error) {
    console.error('[vehicles/:id.PATCH]', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'modelId ou sellerId invalide' },
          { status: 400 }
        )
      }
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Véhicule introuvable' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Impossible de mettre à jour le véhicule' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.vehicle.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[vehicles/:id.DELETE]', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Véhicule introuvable' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Impossible de supprimer le véhicule' },
      { status: 500 }
    )
  }
}

