'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/app/lib/fetchWithAuth'

export default function CreateSellerForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      phone: formData.get('phone')?.toString().trim() || '',
      website: formData.get('website')?.toString().trim() || ''
    }

    // Préparer le body pour l'API
    const body: Record<string, any> = {
      name: data.name
    }

    // Ajouter email seulement s'il est fourni
    if (data.email) {
      body.email = data.email
    } else {
      body.email = null
    }

    // Ajouter phone seulement s'il est fourni
    if (data.phone) {
      body.phone = data.phone
    } else {
      body.phone = null
    }

    // Ajouter website seulement s'il est fourni
    if (data.website) {
      body.website = data.website
    } else {
      body.website = null
    }

    try {
      const response = await fetchWithAuth('/api/v2/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.')
          setTimeout(() => window.location.href = '/', 2000)
          return
        }

        setError(result.error || 'Une erreur est survenue lors de la création du vendeur')
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/?mode=sellers')
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('[CreateSellerForm]', err)
      setError('Erreur de connexion. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom (obligatoire) */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
          Nom <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Ex: Auto Plus"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
      </div>

      {/* Email (optionnel) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Ex: contact@autoplus.fr"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
        <p className="text-xs text-slate-500 mt-1">L'email doit être unique si fourni</p>
      </div>

      {/* Téléphone (optionnel) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-900 mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Ex: +33 1 23 45 67 89"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
      </div>

      {/* Site web (optionnel) */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-slate-900 mb-2">
          Site web
        </label>
        <input
          type="url"
          id="website"
          name="website"
          placeholder="Ex: https://www.autoplus.fr"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
      </div>

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Vendeur créé avec succès ! Redirection en cours...
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/?mode=sellers')}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Création...' : 'Créer le vendeur'}
        </button>
      </div>
    </form>
  )
}

