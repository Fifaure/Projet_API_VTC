import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/serverAuth'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import VehiclesList from '../VehiclesList'

async function getVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        model: true,
        seller: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Sérialiser les dates et Decimal pour le composant client
    return vehicles.map((vehicle) => ({
      ...vehicle,
      priceEUR: vehicle.priceEUR ? vehicle.priceEUR.toString() : null,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
      model: {
        ...vehicle.model,
        createdAt: vehicle.model.createdAt.toISOString(),
        updatedAt: vehicle.model.updatedAt.toISOString()
      },
      seller: vehicle.seller ? {
        ...vehicle.seller,
        createdAt: vehicle.seller.createdAt.toISOString(),
        updatedAt: vehicle.seller.updatedAt.toISOString()
      } : null
    }))
  } catch (error) {
    console.error('[getVehicles]', error)
    return []
  }
}

export default async function VehiclesListPage() {
  const session = await getServerSession()
  const isAuthenticated = !!session

  const vehicles = await getVehicles()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Liste des véhicules</h1>
              <p className="text-slate-600 mt-1">{vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''} trouvé{vehicles.length > 1 ? 's' : ''}</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
          </div>
        </div>
        <VehiclesList vehicles={vehicles} isAuthenticated={isAuthenticated} />
      </div>
    </main>
  )
}

