import { getServerSession } from '@/app/lib/serverAuth'
import { prisma } from '@/app/lib/prisma'
import ModelsList from '../ModelsList'
import Navbar from '@/app/(pages)/home/Navbar'
import ProfileMenu from '@/app/(pages)/home/ProfileMenu'

async function getModels() {
  try {
    const models = await prisma.model.findMany({
      orderBy: [
        { brand: 'asc' },
        { name: 'asc' }
      ]
    })
    // Sérialiser les dates pour le composant client
    return models.map(model => ({
      ...model,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('[getModels]', error)
    return []
  }
}

export default async function ModelsListPage() {
  const session = await getServerSession()
  const isAuthenticated = !!session
  const isAdmin = session?.role === 'ADMIN'

  const models = await getModels()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-800">Liste des modèles</h1>
            {isAuthenticated ? (
              <ProfileMenu name={session.name ?? null} email={session.email} />
            ) : (
              <a
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Se connecter
              </a>
            )}
          </div>
          <p className="text-slate-600">
            {models.length} modèle{models.length > 1 ? 's' : ''} trouvé{models.length > 1 ? 's' : ''}
          </p>
        </div>

        <Navbar isAdmin={isAdmin} currentMode="models" />

        <ModelsList models={models} isAuthenticated={isAuthenticated} />
      </div>
    </main>
  )
}

