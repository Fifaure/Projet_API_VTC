import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import { getAuthSecret } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import VehiclesList from '../VehiclesList'

async function validateAuthorization(): Promise<{ email: string; name?: string | null } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const secret = getAuthSecret()

  if (!token || !secret) {
    return null
  }

  try {
    const payload = jwt.verify(token, secret) as {
      email: string
      name?: string | null
    }
    return { email: payload.email, name: payload.name }
  } catch (error) {
    console.error('[list.validateAuthorization]', error)
    return null
  }
}

async function getVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        model: true,
        seller: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return vehicles.map(vehicle => ({
      ...vehicle,
      priceEUR: vehicle.priceEUR ? vehicle.priceEUR.toString() : null
    }))
  } catch (error) {
    console.error('[getVehicles]', error)
    return []
  }
}

export default async function VehiclesListPage() {
  const session = await validateAuthorization()

  if (!session) {
    redirect('/')
  }

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
              href="/home?mode=vehicles"
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
          </div>
        </div>
        <VehiclesList vehicles={vehicles} />
      </div>
    </main>
  )
}

