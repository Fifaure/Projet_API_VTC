'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchWithAuth } from '@/app/lib/fetchWithAuth'

type Vehicle = {
  id: string
  modelId: string
  sellerId: string | null
  mileageKm: number | null
  priceEUR: string | null
  color: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  model: {
    id: string
    name: string
    brand: string
    yearStart: number | null
    yearEnd: number | null
  }
  seller: {
    id: string
    name: string
    email: string | null
  } | null
}

type VehiclesListProps = {
  vehicles: Vehicle[]
  isAuthenticated: boolean
}

export default function VehiclesList({ vehicles, isAuthenticated }: VehiclesListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, modelName: string, brand: string) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le véhicule ${brand} ${modelName} ?\n\nCette action est irréversible.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(id)

    try {
      // Utilise fetchWithAuth qui rafraîchit automatiquement le token si expiré
      const response = await fetchWithAuth(`/api/v2/vehicles/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }))

        // Si toujours 401 après refresh, rediriger vers login
        if (response.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.')
          window.location.href = '/'
          return
        }

        alert(`Erreur lors de la suppression : ${error.error || 'Erreur inconnue'}`)
        return
      }

      // Rafraîchir la page pour mettre à jour la liste
      router.refresh()
    } catch (error) {
      console.error('[VehiclesList.handleDelete]', error)
      alert('Erreur lors de la suppression du véhicule')
    } finally {
      setDeletingId(null)
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 text-center">
        <p className="text-slate-600 mb-4">Aucun véhicule trouvé.</p>
        {isAuthenticated && (
          <Link
            href="/CRUD/vehicles/create"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer un véhicule
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Modèle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Vendeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Kilométrage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Couleur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {vehicle.model.brand} {vehicle.model.name}
                  </div>
                  {(vehicle.model.yearStart || vehicle.model.yearEnd) && (
                    <div className="text-xs text-slate-500">
                      {vehicle.model.yearStart || '?'}-{vehicle.model.yearEnd || '?'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vehicle.seller ? (
                    <div>
                      <div className="text-sm text-slate-900">{vehicle.seller.name}</div>
                      {vehicle.seller.email && (
                        <div className="text-xs text-slate-500">{vehicle.seller.email}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Aucun</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {vehicle.mileageKm ? `${vehicle.mileageKm.toLocaleString()} km` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {vehicle.priceEUR ? `${parseFloat(vehicle.priceEUR).toLocaleString('fr-FR')} €` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {vehicle.color || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {isAuthenticated ? (
                    <div className="flex gap-2">
                      <Link
                        href={`/CRUD/vehicles/edit/${vehicle.id}`}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Modifier
                      </Link>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => handleDelete(vehicle.id, vehicle.model.name, vehicle.model.brand)}
                        disabled={deletingId === vehicle.id}
                        className={`text-red-600 hover:text-red-900 ${
                          deletingId === vehicle.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {deletingId === vehicle.id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Lecture seule</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

