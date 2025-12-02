import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { signAccessToken, signRefreshToken, verifyPassword } from '@/app/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body?.email?.toString().toLowerCase().trim()
    const password = body?.password?.toString()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'email et password sont obligatoires' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name
    })

    const refreshToken = signRefreshToken({
      sub: user.id,
      type: 'refresh'
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    })

    const response = NextResponse.json({
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name }
      }
    })

    response.cookies.set({
      name: 'auth_token',
      value: accessToken,
      httpOnly: true,
      maxAge: 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })

    response.cookies.set({
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne, impossible de se connecter' },
      { status: 500 }
    )
  }
}
