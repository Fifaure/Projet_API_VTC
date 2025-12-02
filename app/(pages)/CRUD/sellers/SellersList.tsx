'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchWithAuth } from '@/app/lib/fetchWithAuth'

type Seller = {
  id: string
  name: string
  email: string | null
  phone: string | null
  website: string | null
  createdAt: string
  updatedAt: string
}

type SellersListProps = {
  sellers: Seller[]
  isAuthenticated: boolean
}

export default function SellersList({ sellers, isAuthenticated }: SellersListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le vendeur "${name}" ?\n\nCette action est irréversible.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetchWithAuth(`/api/v2/sellers/${id}`, {
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
      console.error('[SellersList.handleDelete]', error)
      alert('Erreur lors de la suppression du vendeur')
    } finally {
      setDeletingId(null)
    }
  }

  if (sellers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 text-center">
        <p className="text-slate-600 mb-4">Aucun vendeur trouvé.</p>
        {isAuthenticated && (
          <Link
            href="/CRUD/sellers/create"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer un vendeur
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
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Site web
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{seller.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{seller.email || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {seller.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {seller.website ? (
                    <a
                      href={seller.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {seller.website}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {isAuthenticated ? (
                    <div className="flex gap-2">
                      <Link
                        href={`/CRUD/sellers/edit/${seller.id}`}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Modifier
                      </Link>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => handleDelete(seller.id, seller.name)}
                        disabled={deletingId === seller.id}
                        className={`text-red-600 hover:text-red-900 ${
                          deletingId === seller.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {deletingId === seller.id ? 'Suppression...' : 'Supprimer'}
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

