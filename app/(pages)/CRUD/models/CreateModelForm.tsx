'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateModelForm() {
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
      brand: formData.get('brand')?.toString().trim() || '',
      yearStart: formData.get('yearStart')?.toString().trim() || '',
      yearEnd: formData.get('yearEnd')?.toString().trim() || ''
    }

    // Préparer le body pour l'API
    const body: Record<string, any> = {
      name: data.name,
      brand: data.brand
    }

    // Ajouter yearStart seulement s'il est fourni
    if (data.yearStart) {
      body.yearStart = data.yearStart
    }

    // Ajouter yearEnd seulement s'il est fourni
    if (data.yearEnd) {
      body.yearEnd = data.yearEnd
    }

    try {
      const response = await fetch('/api/v1/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('[CreateModelForm] API Error:', result)
        setError(result.error || `Erreur ${response.status}: Une erreur est survenue lors de la création du modèle`)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/home?mode=models')
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('[CreateModelForm]', err)
      setError('Erreur de connexion. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom (obligatoire) */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
          Nom du modèle <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Ex: Classe A"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
      </div>

      {/* Marque (obligatoire) */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-slate-900 mb-2">
          Marque <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          required
          placeholder="Ex: Mercedes-Benz"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
        <p className="text-xs text-slate-500 mt-1">La combinaison nom + marque doit être unique</p>
      </div>

      {/* Année de début (optionnel) */}
      <div>
        <label htmlFor="yearStart" className="block text-sm font-medium text-slate-900 mb-2">
          Année de début
        </label>
        <input
          type="number"
          id="yearStart"
          name="yearStart"
          min="1900"
          max="2100"
          step="1"
          placeholder="Ex: 2020"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
      </div>

      {/* Année de fin (optionnel) */}
      <div>
        <label htmlFor="yearEnd" className="block text-sm font-medium text-slate-900 mb-2">
          Année de fin
        </label>
        <input
          type="number"
          id="yearEnd"
          name="yearEnd"
          min="1900"
          max="2100"
          step="1"
          placeholder="Ex: 2024"
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
          Modèle créé avec succès ! Redirection en cours...
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/home?mode=models')}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Création...' : 'Créer le modèle'}
        </button>
      </div>
    </form>
  )
}

