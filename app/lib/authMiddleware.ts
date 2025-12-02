import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getAuthSecret } from './auth'

export interface AuthenticatedUser {
  sub: string
  email: string
  name?: string | null
}

export interface AuthResult {
  authenticated: true
  user: AuthenticatedUser
}

export interface AuthError {
  authenticated: false
  response: NextResponse
}

export type AuthCheck = AuthResult | AuthError

export function verifyAuth(request: NextRequest): AuthCheck {
  const authHeader = request.headers.get('Authorization')
  let token: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  }

  if (!token) {
    token = request.cookies.get('auth_token')?.value ?? null
  }

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }
  }

  try {
    const secret = getAuthSecret()
    const decoded = jwt.verify(token, secret) as AuthenticatedUser

    return { authenticated: true, user: decoded }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: 'Token expiré, veuillez vous reconnecter' },
          { status: 401 }
        )
      }
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: 'Token invalide' },
          { status: 401 }
        )
      }
    }

    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 401 }
      )
    }
  }
}

export function requireAuth(request: NextRequest): AuthCheck {
  return verifyAuth(request)
}
