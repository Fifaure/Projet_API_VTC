import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/serverAuth'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import ModelsList from '../ModelsList'

async function getModels() {
  try {
    const models = await prisma.model.findMany({
      orderBy: [
        { brand: 'asc' },
        { name: 'asc' }
      ]
    })
    return models
  } catch (error) {
    console.error('[getModels]', error)
    return []
  }
}

export default async function ModelsListPage() {
  const session = await getServerSession()
  const isAuthenticated = !!session

  const models = await getModels()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Liste des modèles</h1>
              <p className="text-slate-600 mt-1">{models.length} modèle{models.length > 1 ? 's' : ''} trouvé{models.length > 1 ? 's' : ''}</p>
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
        <ModelsList models={models} isAuthenticated={isAuthenticated} />
      </div>
    </main>
  )
}

