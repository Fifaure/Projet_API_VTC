import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/serverAuth'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import SellersList from '../SellersList'

async function getSellers() {
  try {
    const sellers = await prisma.seller.findMany({
      orderBy: { createdAt: 'desc' }
    })
    // Sérialiser les dates pour le composant client
    return sellers.map(seller => ({
      ...seller,
      createdAt: seller.createdAt.toISOString(),
      updatedAt: seller.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('[getSellers]', error)
    return []
  }
}

export default async function SellersListPage() {
  const session = await getServerSession()
  const isAuthenticated = !!session

  if (!session || session.role !== 'ADMIN') {
    redirect('/home')
  }

  const sellers = await getSellers()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Liste des vendeurs</h1>
              <p className="text-slate-600 mt-1">{sellers.length} vendeur{sellers.length > 1 ? 's' : ''} trouvé{sellers.length > 1 ? 's' : ''}</p>
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
        <SellersList sellers={sellers} isAuthenticated={isAuthenticated} />
      </div>
    </main>
  )
}

