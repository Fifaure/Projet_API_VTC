'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

type Mode = 'vehicles' | 'models' | 'sellers' | 'users'

type NavbarProps = {
  isAdmin?: boolean
  currentMode?: Mode
}

type ModeConfig = { id: Mode; label: string; icon: ReactNode; adminOnly?: boolean }

const allModes: ModeConfig[] = [
  {
    id: 'vehicles',
    label: 'Véhicules',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  {
    id: 'models',
    label: 'Modèles',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'sellers',
    label: 'Vendeurs',
    adminOnly: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    adminOnly: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
]

export default function Navbar({ isAdmin = false, currentMode: propMode }: NavbarProps) {
  const searchParams = useSearchParams()
  const currentMode = propMode || (searchParams.get('mode') as Mode) || 'vehicles'

  // Filtrer les onglets admin si non admin
  const modes = isAdmin
    ? allModes
    : allModes.filter(m => !m.adminOnly)

  return (
    <nav className="bg-white rounded-xl shadow-md border border-slate-200 mb-6">
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          {modes.map((mode) => {
            const isActive = currentMode === mode.id
            const isAdminTab = mode.adminOnly
            return (
              <Link
                key={mode.id}
                href={`/home?mode=${mode.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? isAdminTab
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-blue-600 text-white shadow-md'
                    : isAdminTab
                      ? 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
