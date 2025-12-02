'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type ProfileMenuProps = {
  name: string | null
  email: string
}

export default function ProfileMenu({ name, email }: ProfileMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const displayName = name || email
  const initial = displayName.charAt(0).toUpperCase()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/v2/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/')
      router.refresh()
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-slate-500">Connecté en tant que</p>
          <p className="text-lg font-semibold text-slate-700">{displayName}</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg hover:bg-blue-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {initial}
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900 truncate">{name || 'Utilisateur'}</p>
            <p className="text-xs text-slate-500 truncate">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      )}
    </div>
  )
}

