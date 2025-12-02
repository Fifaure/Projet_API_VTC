'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/app/lib/fetchWithAuth'

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

type Vehicle = {
  id: string
  modelId: string
  sellerId: string | null
  mileageKm: number | null
  priceEUR: string | null
  color: string | null
  notes: string | null
  model: Model
  seller: Seller | null
}

type EditVehicleFormProps = {
  vehicle: Vehicle
  models: Model[]
  sellers: Seller[]
}

export default function EditVehicleForm({ vehicle, models, sellers }: EditVehicleFormProps) {
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
    const body: Record<string, any> = {}

    // Ajouter modelId seulement s'il a changé
    if (data.modelId && data.modelId !== vehicle.modelId) {
      body.modelId = data.modelId
    }

    // Ajouter sellerId seulement s'il a changé
    const currentSellerId = vehicle.sellerId || ''
    if (data.sellerId !== currentSellerId) {
      body.sellerId = data.sellerId || null
    }

    // Ajouter mileageKm seulement s'il a changé
    const currentMileage = vehicle.mileageKm?.toString() || ''
    if (data.mileageKm && data.mileageKm !== currentMileage) {
      body.mileageKm = data.mileageKm
    } else if (!data.mileageKm && vehicle.mileageKm !== null) {
      body.mileageKm = null
    }

    // Ajouter priceEUR seulement s'il a changé
    const currentPrice = vehicle.priceEUR || ''
    if (data.priceEUR && data.priceEUR !== currentPrice) {
      body.priceEUR = data.priceEUR
    } else if (!data.priceEUR && vehicle.priceEUR !== null) {
      body.priceEUR = null
    }

    // Ajouter color seulement s'il a changé
    const currentColor = vehicle.color || ''
    if (data.color !== currentColor) {
      body.color = data.color || null
    }

    // Ajouter notes seulement s'il a changé
    const currentNotes = vehicle.notes || ''
    if (data.notes !== currentNotes) {
      body.notes = data.notes || null
    }

    if (Object.keys(body).length === 0) {
      setError('Aucune modification détectée')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetchWithAuth(`/api/v2/vehicles/${vehicle.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('[EditVehicleForm] API Error:', result)
        
        if (response.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.')
          setTimeout(() => window.location.href = '/', 2000)
          return
        }
        
        setError(result.error || `Erreur ${response.status}: Une erreur est survenue lors de la modification`)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/CRUD/vehicles/list')
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('[EditVehicleForm]', err)
      setError('Erreur de connexion. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Modèle */}
      <div>
        <label htmlFor="modelId" className="block text-sm font-medium text-slate-900 mb-2">
          Modèle <span className="text-red-500">*</span>
        </label>
        <select
          id="modelId"
          name="modelId"
          required
          defaultValue={vehicle.modelId}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white"
        >
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

      {/* Vendeur */}
      <div>
        <label htmlFor="sellerId" className="block text-sm font-medium text-slate-900 mb-2">
          Vendeur
        </label>
        <select
          id="sellerId"
          name="sellerId"
          defaultValue={vehicle.sellerId || ''}
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
          defaultValue={vehicle.mileageKm || ''}
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
          defaultValue={vehicle.priceEUR || ''}
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
          defaultValue={vehicle.color || ''}
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
          defaultValue={vehicle.notes || ''}
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
          Véhicule modifié avec succès ! Redirection en cours...
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/CRUD/vehicles/list')}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Modification...' : 'Modifier le véhicule'}
        </button>
      </div>
    </form>
  )
}

