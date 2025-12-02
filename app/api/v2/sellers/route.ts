import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { requireAuth } from '@/app/lib/authMiddleware'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const sellers = await prisma.seller.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ data: sellers })
  } catch {
    return NextResponse.json({ error: 'Impossible de récupérer les vendeurs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (!auth.authenticated) return auth.response

  try {
    const body = await request.json()
    const name = body?.name?.toString().trim()
    const email = body?.email?.toString().trim() || null
    const phone = body?.phone?.toString().trim() || null
    const website = body?.website?.toString().trim() || null

    if (!name) {
      return NextResponse.json({ error: 'Le nom est obligatoire' }, { status: 400 })
    }

    if (email) {
      const existing = await prisma.seller.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ error: 'Un vendeur avec cet email existe déjà' }, { status: 409 })
      }
    }

    const seller = await prisma.seller.create({ data: { name, email, phone, website } })

    return NextResponse.json({ data: seller }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Impossible de créer le vendeur' }, { status: 500 })
  }
}
