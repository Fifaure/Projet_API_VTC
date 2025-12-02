import { getServerSession } from '@/app/lib/serverAuth'
import Navbar from './home/Navbar'
import CRUDActions from './home/CRUDActions'
import ProfileMenu from './home/ProfileMenu'
import Link from 'next/link'

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ mode?: string }> | { mode?: string }
}) {
  const session = await getServerSession()
  const isAuthenticated = !!session

  const params = await Promise.resolve(searchParams)
  const currentMode = (params.mode || 'vehicles') as 'vehicles' | 'models' | 'sellers'

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-800">Tableau de bord</h1>
            {isAuthenticated ? (
              <ProfileMenu name={session.name ?? null} email={session.email} />
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Se connecter
              </Link>
            )}
          </div>
          <p className="text-slate-600">Gérez vos données avec les opérations CRUD</p>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* CRUD Actions */}
        <CRUDActions mode={currentMode} isAuthenticated={isAuthenticated} />
      </div>
    </main>
  )
}
