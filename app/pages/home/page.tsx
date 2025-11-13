import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import { getAuthSecret } from '@/app/lib/auth'

async function validateAuthorization(): Promise<{ email: string; name?: string | null } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const secret = getAuthSecret()

  if (!token || !secret) {
    return null
  }

  try {
    const payload = jwt.verify(token, secret) as {
      email: string
      name?: string | null
    }
    return { email: payload.email, name: payload.name }
  } catch (error) {
    console.error('[home.validateAuthorization]', error)
    return null
  }
}

export default async function HomePage() {
  const session = await validateAuthorization()

  if (!session) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-2xl rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-slate-800">Accueil</h1>
        <p className="mt-4 text-sm text-slate-600">
          Espace réservé aux utilisateurs authentifiés. Contenu à venir.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Email: {session.email}
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Nom: {session.name}
        </p>
      </section>
    </main>
  )
}

