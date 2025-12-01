import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import { getAuthSecret } from '@/app/lib/auth'
import Link from 'next/link'
import CreateSellerForm from '../CreateSellerForm'

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
    console.error('[create.validateAuthorization]', error)
    return null
  }
}

export default async function CreateSellerPage() {
  const session = await validateAuthorization()

  if (!session) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-2xl rounded-lg bg-white p-8 shadow">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Créer un vendeur</h1>
              <p className="text-sm text-slate-600 mt-1">Remplissez le formulaire pour ajouter un nouveau vendeur</p>
            </div>
            <Link
              href="/home?mode=sellers"
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
          </div>
        </div>
        <CreateSellerForm />
      </section>
    </main>
  )
}

