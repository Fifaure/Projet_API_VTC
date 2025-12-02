import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { requireAuth } from '@/app/lib/authMiddleware'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    
    if (auth.authenticated) {
      await prisma.user.update({
        where: { id: auth.user.sub },
        data: { refreshToken: null }
      })
    }

    const response = NextResponse.json({ message: 'Déconnexion réussie' })

    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })

    response.cookies.set({
      name: 'refresh_token',
      value: '',
      httpOnly: true,
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne lors de la déconnexion' },
      { status: 500 }
    )
  }
}
