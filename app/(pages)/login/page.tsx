'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState, useTransition } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: formData.get('email')?.toString().trim(),
      password: formData.get('password')?.toString()
    }

    if (!payload.email || !payload.password) {
      setError('Email et mot de passe sont obligatoires.')
      return
    }

    try {
      // Utilise v2 pour obtenir access token + refresh token
      const response = await fetch('/api/v2/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const body = await response.json().catch(() => null)

      if (!response.ok) {
        setError(body?.error ?? 'Connexion impossible. Vérifiez vos identifiants.')
        return
      }

      startTransition(() => {
        router.push('/')
      })
    } catch (err) {
      console.error('[login.submit]', err)
      setError("Erreur réseau inattendue. Veuillez réessayer plus tard.")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800">
          Connexion
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
              Adresse e-mail
            </label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              id="email"
              name="email"
              type="email"
              placeholder="vous@example.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : null}
          <button
            className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-60"
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Pas encore de compte ?{' '}
          <Link className="font-medium text-slate-900 underline" href="/register">
            Créer un compte
          </Link>
        </p>
      </section>
    </main>
  )
}
