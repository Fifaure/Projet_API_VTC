'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type Seller = {
  id: string
  name: string
  email: string | null
  phone: string | null
  website: string | null
}

type EditSellerFormProps = {
  seller: Seller
}

export default function EditSellerForm({ seller }: EditSellerFormProps) {
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

    // Préparer le body pour l'API (seulement les champs modifiés)
    const body: Record<string, any> = {}

    if (data.name !== seller.name) {
      body.name = data.name
    }

    if (data.email !== (seller.email || '')) {
      body.email = data.email || null
    }

    if (data.phone !== (seller.phone || '')) {
      body.phone = data.phone || null
    }

    if (data.website !== (seller.website || '')) {
      body.website = data.website || null
    }

    if (Object.keys(body).length === 0) {
      setError('Aucune modification détectée')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/v1/sellers/${seller.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('[EditSellerForm] API Error:', result)
        setError(result.error || `Erreur ${response.status}: Une erreur est survenue lors de la modification`)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/CRUD/sellers/list')
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('[EditSellerForm]', err)
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
          defaultValue={seller.name}
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
          defaultValue={seller.email || ''}
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
          defaultValue={seller.phone || ''}
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
          defaultValue={seller.website || ''}
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
          Vendeur modifié avec succès ! Redirection en cours...
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/CRUD/sellers/list')}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Modification...' : 'Modifier le vendeur'}
        </button>
      </div>
    </form>
  )
}

