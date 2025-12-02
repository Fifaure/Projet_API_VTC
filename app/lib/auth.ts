import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'node:crypto'

const BCRYPT_SALT_ROUNDS = 10
const ACCESS_TOKEN_TTL = '5m'
const REFRESH_TOKEN_TTL = '7d'

const AUTH_SECRET_GLOBAL_KEY = Symbol.for('app.auth.secret')
const REFRESH_SECRET_GLOBAL_KEY = Symbol.for('app.auth.refresh.secret')

function getGlobalAuthSecretStore(): { value?: string } {
  const globalObject = globalThis as Record<symbol, { value?: string }>
  if (!globalObject[AUTH_SECRET_GLOBAL_KEY]) {
    globalObject[AUTH_SECRET_GLOBAL_KEY] = {}
  }
  return globalObject[AUTH_SECRET_GLOBAL_KEY]
}

function getGlobalRefreshSecretStore(): { value?: string } {
  const globalObject = globalThis as Record<symbol, { value?: string }>
  if (!globalObject[REFRESH_SECRET_GLOBAL_KEY]) {
    globalObject[REFRESH_SECRET_GLOBAL_KEY] = {}
  }
  return globalObject[REFRESH_SECRET_GLOBAL_KEY]
}

function resolveAuthSecret(): string {
  const fromEnv = process.env.AUTH_SECRET
  if (fromEnv) return fromEnv

  if (process.env.NODE_ENV !== 'production') {
    const store = getGlobalAuthSecretStore()
    if (!store.value) {
      store.value = randomBytes(32).toString('hex')
    }
    return store.value
  }

  throw new Error('AUTH_SECRET must be set to sign authentication tokens')
}

function resolveRefreshSecret(): string {
  const fromEnv = process.env.REFRESH_SECRET
  if (fromEnv) return fromEnv

  if (process.env.NODE_ENV !== 'production') {
    const store = getGlobalRefreshSecretStore()
    if (!store.value) {
      store.value = randomBytes(32).toString('hex')
    }
    return store.value
  }

  throw new Error('REFRESH_SECRET must be set to sign refresh tokens')
}

export async function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS)
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  if (!hashedPassword) return false
  return bcrypt.compare(plainPassword, hashedPassword)
}

export interface SessionPayload {
  sub: string
  email: string
  name?: string | null
}

export interface RefreshPayload {
  sub: string
  type: 'refresh'
}

export function signAccessToken(payload: SessionPayload, options?: jwt.SignOptions) {
  const secret = resolveAuthSecret()
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_TTL, ...options })
}

export function signRefreshToken(payload: RefreshPayload, options?: jwt.SignOptions) {
  const secret = resolveRefreshSecret()
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_TTL, ...options })
}

export function verifyRefreshToken(token: string): RefreshPayload | null {
  try {
    const secret = resolveRefreshSecret()
    const decoded = jwt.verify(token, secret) as RefreshPayload
    if (decoded.type !== 'refresh') return null
    return decoded
  } catch {
    return null
  }
}

export function signSessionToken(payload: SessionPayload, options?: jwt.SignOptions) {
  return signAccessToken(payload, options)
}

export function getAuthSecret() {
  return resolveAuthSecret()
}

export function getRefreshSecret() {
  return resolveRefreshSecret()
}
