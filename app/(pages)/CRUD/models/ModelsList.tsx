'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchWithAuth } from '@/app/lib/fetchWithAuth'

type Model = {
  id: string
  name: string
  brand: string
  yearStart: number | null
  yearEnd: number | null
  createdAt: string
  updatedAt: string
}

type ModelsListProps = {
  models: Model[]
}

export default function ModelsList({ models }: ModelsListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string, brand: string) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le modèle "${brand} ${name}" ?\n\nCette action est irréversible.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetchWithAuth(`/api/v2/models/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        
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
      console.error('[ModelsList.handleDelete]', error)
      alert('Erreur lors de la suppression du modèle')
    } finally {
      setDeletingId(null)
    }
  }

  if (models.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 text-center">
        <p className="text-slate-600 mb-4">Aucun modèle trouvé.</p>
        <Link
          href="/CRUD/models/create"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Créer un modèle
        </Link>
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
                Marque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Années
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{model.brand}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{model.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {(model.yearStart || model.yearEnd) ? (
                    `${model.yearStart || '?'} - ${model.yearEnd || '?'}`
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Link
                      href={`/CRUD/models/edit/${model.id}`}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Modifier
                    </Link>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => handleDelete(model.id, model.name, model.brand)}
                      disabled={deletingId === model.id}
                      className={`text-red-600 hover:text-red-900 ${
                        deletingId === model.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {deletingId === model.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

