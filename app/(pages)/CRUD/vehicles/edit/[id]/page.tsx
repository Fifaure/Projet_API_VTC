import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/serverAuth'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import EditVehicleForm from '../../EditVehicleForm'

export default async function EditVehiclePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  const { id } = await params

  // Récupérer le véhicule et les données nécessaires
  const [vehicle, models, sellers] = await Promise.all([
    prisma.vehicle.findUnique({
      where: { id },
      include: {
        model: true,
        seller: true
      }
    }),
    prisma.model.findMany({
      orderBy: [
        { brand: 'asc' },
        { name: 'asc' }
      ]
    }),
    prisma.seller.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!vehicle) {
    redirect('/CRUD/vehicles/list')
  }

  // Sérialiser pour le composant client
  const serializedVehicle = {
    id: vehicle.id,
    modelId: vehicle.modelId,
    sellerId: vehicle.sellerId,
    mileageKm: vehicle.mileageKm,
    priceEUR: vehicle.priceEUR ? vehicle.priceEUR.toString() : null,
    color: vehicle.color,
    notes: vehicle.notes,
    model: {
      id: vehicle.model.id,
      name: vehicle.model.name,
      brand: vehicle.model.brand,
      yearStart: vehicle.model.yearStart,
      yearEnd: vehicle.model.yearEnd
    },
    seller: vehicle.seller ? {
      id: vehicle.seller.id,
      name: vehicle.seller.name,
      email: vehicle.seller.email,
      phone: vehicle.seller.phone
    } : null
  }

  // Sérialiser models et sellers (exclure les dates)
  const serializedModels = models.map(m => ({
    id: m.id,
    name: m.name,
    brand: m.brand,
    yearStart: m.yearStart,
    yearEnd: m.yearEnd
  }))

  const serializedSellers = sellers.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone
  }))

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-2xl rounded-lg bg-white p-8 shadow">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Modifier un véhicule</h1>
              <p className="text-sm text-slate-600 mt-1">Modifiez les informations du véhicule</p>
            </div>
            <Link
              href="/?mode=vehicles"
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
          </div>
        </div>
        <EditVehicleForm vehicle={serializedVehicle} models={serializedModels} sellers={serializedSellers} />
      </section>
    </main>
  )
}

