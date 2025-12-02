import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { signAccessToken, verifyRefreshToken } from '@/app/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    let refreshToken: string | null = null

    try {
      const body = await request.json()
      refreshToken = body?.refreshToken?.toString() || null
    } catch {
      // Body vide
    }

    if (!refreshToken) {
      refreshToken = request.cookies.get('refresh_token')?.value || null
    }

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token requis' },
        { status: 400 }
      )
    }

    const decoded = verifyRefreshToken(refreshToken)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Refresh token invalide ou expiré' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 401 }
      )
    }

    if (user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token révoqué ou invalide' },
        { status: 401 }
      )
    }

    const newAccessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name
    })

    const response = NextResponse.json({
      data: {
        accessToken: newAccessToken,
        user: { id: user.id, email: user.email, name: user.name }
      }
    })

    response.cookies.set({
      name: 'auth_token',
      value: newAccessToken,
      httpOnly: true,
      maxAge: 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne, impossible de rafraîchir le token' },
      { status: 500 }
    )
  }
}
