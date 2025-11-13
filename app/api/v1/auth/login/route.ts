import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { signSessionToken, verifyPassword } from '@/app/lib/auth'

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

    const user = await prisma.user.findUnique({
      where: { email }
    })

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

    const token = signSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name
    })

    const response = NextResponse.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      maxAge: 60 * 5, // 5 minutes
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })

    return response
  } catch (error) {
    console.error('[auth/login.POST]', error)

    return NextResponse.json(
      { error: 'Erreur interne, impossible de se connecter' },
      { status: 500 }
    )
  }
}

