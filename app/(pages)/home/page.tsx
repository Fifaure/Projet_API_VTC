import { getServerSession } from '@/app/lib/serverAuth'
import Navbar from './Navbar'
import CRUDActions from './CRUDActions'
import ProfileMenu from './ProfileMenu'

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ mode?: string }> | { mode?: string }
}) {
  const session = await getServerSession()
  const isAuthenticated = !!session

  const params = await Promise.resolve(searchParams)
  const currentMode = (params.mode || 'vehicles') as 'vehicles' | 'models' | 'sellers' | 'users'
  const isAdmin = session?.role === 'ADMIN'

  console.log('[DEBUG] session.role:', session?.role, '| isAdmin:', isAdmin, '| isAuthenticated:', isAuthenticated)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-800">Tableau de bord</h1>
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
            {isAuthenticated
              ? 'Gérez vos données avec les opérations CRUD'
              : 'Consultez les modèles disponibles'}
          </p>
        </div>

        <Navbar isAdmin={isAdmin} />

        <CRUDActions mode={currentMode} isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
      </div>
    </main>
  )
}

