import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { Prisma } from '@/app/generated/prisma/client'
import { requireAuth } from '@/app/lib/authMiddleware'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      orderBy: [{ brand: 'asc' }, { name: 'asc' }]
    })
    return NextResponse.json({ data: models })
  } catch {
    return NextResponse.json({ error: 'Impossible de récupérer les modèles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (!auth.authenticated) return auth.response

  try {
    const body = await request.json()
    const name = body?.name?.toString().trim()
    const brand = body?.brand?.toString().trim()

    if (!name) {
      return NextResponse.json({ error: 'Le nom est obligatoire' }, { status: 400 })
    }

    if (!brand) {
      return NextResponse.json({ error: 'La marque est obligatoire' }, { status: 400 })
    }

    const existing = await prisma.model.findUnique({
      where: { name_brand: { name, brand } }
    })

    if (existing) {
      return NextResponse.json({ error: 'Un modèle avec ce nom et cette marque existe déjà' }, { status: 409 })
    }

    let yearStartValue: number | null | undefined = undefined
    if (body?.yearStart !== undefined) {
      if (body.yearStart === null || body.yearStart === '') {
        yearStartValue = null
      } else {
        const parsed = Number.parseInt(body.yearStart.toString(), 10)
        if (Number.isNaN(parsed)) {
          return NextResponse.json({ error: 'yearStart doit être un entier' }, { status: 400 })
        }
        yearStartValue = parsed
      }
    }

    let yearEndValue: number | null | undefined = undefined
    if (body?.yearEnd !== undefined) {
      if (body.yearEnd === null || body.yearEnd === '') {
        yearEndValue = null
      } else {
        const parsed = Number.parseInt(body.yearEnd.toString(), 10)
        if (Number.isNaN(parsed)) {
          return NextResponse.json({ error: 'yearEnd doit être un entier' }, { status: 400 })
        }
        yearEndValue = parsed
      }
    }

    const model = await prisma.model.create({
      data: { name, brand, yearStart: yearStartValue, yearEnd: yearEndValue }
    })

    return NextResponse.json({ data: model }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Un modèle avec ce nom et cette marque existe déjà' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Impossible de créer le modèle' }, { status: 500 })
  }
}
