'use client'

import Link from 'next/link'
import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('name')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      password: formData.get('password')?.toString()
    }

    if (!payload.email || !payload.password) {
      setError('Email et mot de passe sont obligatoires.')
      return
    }

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const body = await response.json()

      if (!response.ok) {
        setError(body?.error ?? 'Impossible de créer votre compte.')
        return
      }

      setSuccess('Compte créé avec succès. Redirection en cours...')
      startTransition(() => {
        setTimeout(() => {
          router.push('/')
        }, 1200)
      })
    } catch (err) {
      console.error('[register.submit]', err)
      setError("Erreur réseau inattendue. Veuillez réessayer plus tard.")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800">
          Créer un compte
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
              Nom
            </label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              id="name"
              name="name"
              type="text"
              placeholder="Jean Dupont"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              id="email"
              name="email"
              type="email"
              placeholder="vous@example.com"
              autoComplete="email"
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
              autoComplete="new-password"
              required
            />
          </div>
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : null}
          {success ? (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          ) : null}
          <button
            className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-60"
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Déjà inscrit ?{' '}
          <Link className="font-medium text-slate-900 underline" href="/">
            Se connecter
          </Link>
        </p>
      </section>
    </main>
  )
}

