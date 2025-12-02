import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getAuthSecret, signAccessToken, verifyRefreshToken } from './auth'
import { prisma } from './prisma'

export interface SessionUser {
  id: string
  email: string
  name?: string | null
}

export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('auth_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value
  const secret = getAuthSecret()

  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, secret) as {
        sub: string
        email: string
        name?: string | null
      }
      return { id: payload.sub, email: payload.email, name: payload.name }
    } catch (error) {
      if (!(error instanceof jwt.TokenExpiredError)) {
        return null
      }
    }
  }

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken)
      if (!decoded) return null

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub }
      })

      if (!user || user.refreshToken !== refreshToken) return null

      signAccessToken({
        sub: user.id,
        email: user.email,
        name: user.name
      })

      return { id: user.id, email: user.email, name: user.name }
    } catch {
      return null
    }
  }

  return null
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession()
  return session !== null
}
