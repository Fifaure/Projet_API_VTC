'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

type Mode = 'vehicles' | 'models' | 'sellers'

const modes: { id: Mode; label: string; icon: ReactNode }[] = [
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
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }
]

export default function Navbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentMode = (searchParams.get('mode') as Mode) || 'vehicles'

  return (
    <nav className="bg-white rounded-xl shadow-md border border-slate-200 mb-6">
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          {modes.map((mode) => {
            const isActive = currentMode === mode.id
            return (
              <Link
                key={mode.id}
                href={`/?mode=${mode.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
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

