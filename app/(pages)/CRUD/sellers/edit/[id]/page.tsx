import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/serverAuth'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import EditSellerForm from '../../EditSellerForm'

export default async function EditSellerPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }

  const { id } = await params

  const seller = await prisma.seller.findUnique({
    where: { id }
  })

  if (!seller) {
    redirect('/CRUD/sellers/list')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-2xl rounded-lg bg-white p-8 shadow">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Modifier un vendeur</h1>
              <p className="text-sm text-slate-600 mt-1">Modifiez les informations du vendeur</p>
            </div>
            <Link
              href="/home?mode=sellers"
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
          </div>
        </div>
        <EditSellerForm seller={seller} />
      </section>
    </main>
  )
}

