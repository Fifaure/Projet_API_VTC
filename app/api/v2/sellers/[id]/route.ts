import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { Prisma } from '@/app/generated/prisma/client'
import { requireAuth } from '@/app/lib/authMiddleware'

type Props = { params: Promise<{ id: string }> }

export const runtime = 'nodejs'

export async function GET(_: NextRequest, props: Props) {
  try {
    const params = await props.params
    const seller = await prisma.seller.findUnique({
      where: { id: params.id },
      include: { vehicles: { include: { model: true } } }
    })

    if (!seller) {
      return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 })
    }

    return NextResponse.json({ data: seller })
  } catch {
    return NextResponse.json({ error: 'Impossible de récupérer le vendeur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, props: Props) {
  const auth = requireAuth(request)
  if (!auth.authenticated) return auth.response

  try {
    const params = await props.params
    const body = await request.json()
    const data: Prisma.SellerUpdateInput = {}

    if (body?.name !== undefined) {
      const name = body.name?.toString().trim()
      if (!name) {
        return NextResponse.json({ error: 'Le nom ne peut pas être vide' }, { status: 400 })
      }
      data.name = name
    }

    if (body?.email !== undefined) {
      data.email = body.email === null ? null : body.email.toString().trim() || null
    }

    if (body?.phone !== undefined) {
      data.phone = body.phone === null ? null : body.phone.toString().trim() || null
    }

    if (body?.website !== undefined) {
      data.website = body.website === null ? null : body.website.toString().trim() || null
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Aucun champ fourni pour la mise à jour' }, { status: 400 })
    }

    if (data.email) {
      const existing = await prisma.seller.findFirst({
        where: { email: data.email as string, NOT: { id: params.id } }
      })
      if (existing) {
        return NextResponse.json({ error: 'Un vendeur avec cet email existe déjà' }, { status: 409 })
      }
    }

    const seller = await prisma.seller.update({ where: { id: params.id }, data })

    return NextResponse.json({ data: seller })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Un vendeur avec cet email existe déjà' }, { status: 409 })
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 })
      }
    }
    return NextResponse.json({ error: 'Impossible de mettre à jour le vendeur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  const auth = requireAuth(request)
  if (!auth.authenticated) return auth.response

  try {
    const params = await props.params
    await prisma.seller.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 })
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ error: 'Impossible de supprimer ce vendeur car des véhicules y sont associés' }, { status: 409 })
      }
    }
    return NextResponse.json({ error: 'Impossible de supprimer le vendeur' }, { status: 500 })
  }
}
