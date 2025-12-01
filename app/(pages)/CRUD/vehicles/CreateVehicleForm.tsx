'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type Model = {
  id: string
  name: string
  brand: string
  yearStart: number | null
  yearEnd: number | null
}

type Seller = {
  id: string
  name: string
  email: string | null
  phone: string | null
}

type CreateVehicleFormProps = {
  models: Model[]
  sellers: Seller[]
}

export default function CreateVehicleForm({ models, sellers }: CreateVehicleFormProps) {
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
      modelId: formData.get('modelId')?.toString().trim() || '',
      sellerId: formData.get('sellerId')?.toString().trim() || '',
      mileageKm: formData.get('mileageKm')?.toString().trim() || '',
      priceEUR: formData.get('priceEUR')?.toString().trim() || '',
      color: formData.get('color')?.toString().trim() || '',
      notes: formData.get('notes')?.toString().trim() || ''
    }

    // Préparer le body pour l'API
    const body: Record<string, any> = {
      modelId: data.modelId
    }

    // Ajouter sellerId (l'API gère null/undefined/'' correctement)
    if (data.sellerId) {
      body.sellerId = data.sellerId
    } else {
      body.sellerId = ''
    }

    // Ajouter mileageKm seulement s'il est fourni (pas vide)
    if (data.mileageKm) {
      body.mileageKm = data.mileageKm
    }

    // Ajouter priceEUR seulement s'il est fourni (pas vide)
    if (data.priceEUR) {
      body.priceEUR = data.priceEUR
    }

    // Ajouter color seulement s'il est fourni (pas vide)
    if (data.color) {
      body.color = data.color
    }

    // Ajouter notes seulement s'il est fourni (pas vide)
    if (data.notes) {
      body.notes = data.notes
    }

    try {
      const response = await fetch('/api/v1/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('[CreateVehicleForm] API Error:', result)
        setError(result.error || `Erreur ${response.status}: Une erreur est survenue lors de la création du véhicule`)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/home?mode=vehicles')
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('[CreateVehicleForm]', err)
      setError('Erreur de connexion. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Modèle (obligatoire) */}
      <div>
        <label htmlFor="modelId" className="block text-sm font-medium text-slate-900 mb-2">
          Modèle <span className="text-red-500">*</span>
        </label>
        <select
          id="modelId"
          name="modelId"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white"
        >
          <option value="">Sélectionnez un modèle</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.brand} {model.name}
              {model.yearStart || model.yearEnd
                ? ` (${model.yearStart || '?'}-${model.yearEnd || '?'})`
                : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Vendeur (optionnel) */}
      <div>
        <label htmlFor="sellerId" className="block text-sm font-medium text-slate-900 mb-2">
          Vendeur
        </label>
        <select
          id="sellerId"
          name="sellerId"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white"
        >
          <option value="">Aucun vendeur</option>
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.name}
              {seller.email ? ` (${seller.email})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Kilométrage */}
      <div>
        <label htmlFor="mileageKm" className="block text-sm font-medium text-slate-900 mb-2">
          Kilométrage (km)
        </label>
        <input
          type="number"
          id="mileageKm"
          name="mileageKm"
          min="0"
          step="1"
          placeholder="Ex: 50000"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
      </div>

      {/* Prix */}
      <div>
        <label htmlFor="priceEUR" className="block text-sm font-medium text-slate-900 mb-2">
          Prix (EUR)
        </label>
        <input
          type="number"
          id="priceEUR"
          name="priceEUR"
          min="0"
          step="0.01"
          placeholder="Ex: 15000.00"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
      </div>

      {/* Couleur */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-slate-900 mb-2">
          Couleur
        </label>
        <input
          type="text"
          id="color"
          name="color"
          placeholder="Ex: Rouge"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-900 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Informations supplémentaires..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-900 bg-white placeholder:text-slate-400"
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
          Véhicule créé avec succès ! Redirection en cours...
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/home?mode=vehicles')}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Création...' : 'Créer le véhicule'}
        </button>
      </div>
    </form>
  )
}

