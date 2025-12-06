'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

type Mode = 'vehicles' | 'models' | 'sellers' | 'users'

type CRUDActionsProps = {
  mode: Mode
  isAdmin?: boolean
  isAuthenticated?: boolean
}

type ActionConfig = {
  title: string
  description: string
  href: string
  icon: ReactNode
  color: string
  textColor: string
  bgColor: string
}

type ModeConfig = {
  title: string
  actions: ActionConfig[]
}

const crudConfig: Record<Mode, ModeConfig> = {
  vehicles: {
    title: 'Gestion des véhicules',
    actions: [
      {
        title: 'Créer un véhicule',
        description: 'Ajouter un nouveau véhicule à la base de données',
        href: '/CRUD/vehicles/create',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
        color: 'bg-blue-500 hover:bg-blue-600',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Gérer les véhicules',
        description: 'Voir, modifier et supprimer les véhicules',
        href: '/CRUD/vehicles/list',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
        color: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50'
      },
    ]
  },
  models: {
    title: 'Gestion des modèles',
    actions: [
      {
        title: 'Créer un modèle',
        description: 'Ajouter un nouveau modèle à la base de données',
        href: '/CRUD/models/create',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
        color: 'bg-blue-500 hover:bg-blue-600',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Gérer les modèles',
        description: 'Voir, modifier et supprimer les modèles',
        href: '/CRUD/models/list',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
        color: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50'
      },
    ]
  },
  sellers: {
    title: 'Gestion des vendeurs',
    actions: [
      {
        title: 'Créer un vendeur',
        description: 'Ajouter un nouveau vendeur à la base de données',
        href: '/CRUD/sellers/create',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
        color: 'bg-blue-500 hover:bg-blue-600',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Gérer les vendeurs',
        description: 'Voir, modifier et supprimer les vendeurs',
        href: '/CRUD/sellers/list',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
        color: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50'
      },
    ]
  },
  users: {
    title: 'Gestion des utilisateurs',
    actions: [
      {
        title: 'Créer un utilisateur',
        description: 'Ajouter un nouvel utilisateur au système',
        href: '/CRUD/users/create',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        ),
        color: 'bg-purple-500 hover:bg-purple-600',
        textColor: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        title: 'Gérer les utilisateurs',
        description: 'Voir, modifier et supprimer les utilisateurs',
        href: '/CRUD/users/list',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
        color: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50'
      },
    ]
  }
}

export default function CRUDActions({ mode, isAdmin = false, isAuthenticated = true }: CRUDActionsProps) {
  if ((mode === 'users' || mode === 'sellers') && !isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Accès réservé aux administrateurs</p>
      </div>
    )
  }

  const config = crudConfig[mode]

  // Si non connecté et mode models, n'afficher que l'action "Gérer les modèles"
  const actions = !isAuthenticated && mode === 'models'
    ? config.actions.filter(action => action.href.includes('/list'))
    : config.actions

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        {!isAuthenticated ? 'Consulter les modèles' : config.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300"
          >
            <div className="flex items-start gap-4">
              <div className={`${action.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className={action.textColor}>
                  {action.icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                  Accéder
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${action.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
          </Link>
        ))}
      </div>
    </div>
  )
}
