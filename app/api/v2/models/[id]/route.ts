import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { Prisma } from '@/app/generated/prisma/client'
import { requireAuth } from '@/app/lib/authMiddleware'

type Props = { params: Promise<{ id: string }> }

export const runtime = 'nodejs'

export async function GET(_: NextRequest, props: Props) {
  try {
    const params = await props.params
    const model = await prisma.model.findUnique({
      where: { id: params.id },
      include: { vehicles: true }
    })

    if (!model) {
      return NextResponse.json({ error: 'Modèle introuvable' }, { status: 404 })
    }

    return NextResponse.json({ data: model })
  } catch {
    return NextResponse.json({ error: 'Impossible de récupérer le modèle' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, props: Props) {
  const auth = requireAuth(request)
  if (!auth.authenticated) return auth.response

  try {
    const params = await props.params
    const body = await request.json()
    const data: Prisma.ModelUpdateInput = {}

    if (body?.name !== undefined) {
      const name = body.name?.toString().trim()
      if (!name) {
        return NextResponse.json({ error: 'Le nom ne peut pas être vide' }, { status: 400 })
      }
      data.name = name
    }

    if (body?.brand !== undefined) {
      const brand = body.brand?.toString().trim()
      if (!brand) {
        return NextResponse.json({ error: 'La marque ne peut pas être vide' }, { status: 400 })
      }
      data.brand = brand
    }

    if (body?.yearStart !== undefined) {
      if (body.yearStart === null || body.yearStart === '') {
        data.yearStart = null
      } else {
        const parsed = Number.parseInt(body.yearStart.toString(), 10)
        if (Number.isNaN(parsed)) {
          return NextResponse.json({ error: 'yearStart doit être un entier' }, { status: 400 })
        }
        data.yearStart = parsed
      }
    }

    if (body?.yearEnd !== undefined) {
      if (body.yearEnd === null || body.yearEnd === '') {
        data.yearEnd = null
      } else {
        const parsed = Number.parseInt(body.yearEnd.toString(), 10)
        if (Number.isNaN(parsed)) {
          return NextResponse.json({ error: 'yearEnd doit être un entier' }, { status: 400 })
        }
        data.yearEnd = parsed
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Aucun champ fourni pour la mise à jour' }, { status: 400 })
    }

    const model = await prisma.model.update({ where: { id: params.id }, data })

    return NextResponse.json({ data: model })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Un modèle avec ce nom et cette marque existe déjà' }, { status: 409 })
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Modèle introuvable' }, { status: 404 })
      }
    }
    return NextResponse.json({ error: 'Impossible de mettre à jour le modèle' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  const auth = requireAuth(request)
  if (!auth.authenticated) return auth.response

  try {
    const params = await props.params
    await prisma.model.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Modèle introuvable' }, { status: 404 })
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ error: 'Impossible de supprimer ce modèle car des véhicules y sont associés' }, { status: 409 })
      }
    }
    return NextResponse.json({ error: 'Impossible de supprimer le modèle' }, { status: 500 })
  }
}
