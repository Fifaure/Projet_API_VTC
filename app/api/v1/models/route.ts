import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { Prisma } from '@/app/generated/prisma/client'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      orderBy: [
        { brand: 'asc' },
        { name: 'asc' }
      ]
    })
    return NextResponse.json({ data: models })
  } catch (error) {
    console.error('[models.GET]', error)
    return NextResponse.json(
      { error: 'Impossible de récupérer les modèles' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = body?.name?.toString().trim()
    const brand = body?.brand?.toString().trim()
    const yearStart = body?.yearStart
    const yearEnd = body?.yearEnd

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est obligatoire' },
        { status: 400 }
      )
    }

    if (!brand) {
      return NextResponse.json(
        { error: 'La marque est obligatoire' },
        { status: 400 }
      )
    }

    // Vérifier si le modèle existe déjà (contrainte unique [name, brand])
    const existing = await prisma.model.findUnique({
      where: {
        name_brand: {
          name,
          brand
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Un modèle avec ce nom et cette marque existe déjà' },
        { status: 409 }
      )
    }

    // Traiter yearStart
    let yearStartValue: number | null | undefined = undefined
    if (yearStart !== undefined) {
      if (yearStart === null || yearStart === '') {
        yearStartValue = null
      } else {
        const parsed = Number.parseInt(yearStart.toString(), 10)
        if (Number.isNaN(parsed)) {
          return NextResponse.json(
            { error: 'yearStart doit être un entier' },
            { status: 400 }
          )
        }
        yearStartValue = parsed
      }
    }

    // Traiter yearEnd
    let yearEndValue: number | null | undefined = undefined
    if (yearEnd !== undefined) {
      if (yearEnd === null || yearEnd === '') {
        yearEndValue = null
      } else {
        const parsed = Number.parseInt(yearEnd.toString(), 10)
        if (Number.isNaN(parsed)) {
          return NextResponse.json(
            { error: 'yearEnd doit être un entier' },
            { status: 400 }
          )
        }
        yearEndValue = parsed
      }
    }

    const model = await prisma.model.create({
      data: {
        name,
        brand,
        yearStart: yearStartValue,
        yearEnd: yearEndValue
      }
    })

    return NextResponse.json({ data: model }, { status: 201 })
  } catch (error) {
    console.error('[models.POST]', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Un modèle avec ce nom et cette marque existe déjà' },
          { status: 409 }
        )
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('[models.POST] Error details:', {
      message: errorMessage,
      error: error
    })

    return NextResponse.json(
      { error: `Impossible de créer le modèle: ${errorMessage}` },
      { status: 500 }
    )
  }
}

