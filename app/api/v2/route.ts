import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API v2 root',
    version: '2.0.0',
    description: 'API avec authentification JWT et refresh token',
    tokens: {
      accessToken: {
        duration: '30 secondes',
        usage: 'Envoyé dans le header Authorization: Bearer <token>'
      },
      refreshToken: {
        duration: '7 jours',
        usage: 'Utilisé pour obtenir un nouveau access token via /api/v2/auth/refresh'
      }
    },
    endpoints: {
      auth: {
        'POST /api/v1/auth/register': 'Créer un compte',
        'POST /api/v2/auth/login': 'Se connecter (retourne accessToken + refreshToken)',
        'POST /api/v2/auth/refresh': 'Obtenir un nouveau access token',
        'POST /api/v2/auth/logout': 'Se déconnecter (révoque le refresh token)'
      },
      public: {
        'GET /api/v2/vehicles': 'Liste tous les véhicules',
        'GET /api/v2/vehicles/:id': 'Détail d\'un véhicule',
        'GET /api/v2/models': 'Liste tous les modèles',
        'GET /api/v2/models/:id': 'Détail d\'un modèle',
        'GET /api/v2/sellers': 'Liste tous les vendeurs',
        'GET /api/v2/sellers/:id': 'Détail d\'un vendeur'
      },
      protected: {
        'POST /api/v2/vehicles': 'Créer un véhicule (auth requise)',
        'PATCH /api/v2/vehicles/:id': 'Modifier un véhicule (auth requise)',
        'DELETE /api/v2/vehicles/:id': 'Supprimer un véhicule (auth requise)',
        'POST /api/v2/models': 'Créer un modèle (auth requise)',
        'PATCH /api/v2/models/:id': 'Modifier un modèle (auth requise)',
        'DELETE /api/v2/models/:id': 'Supprimer un modèle (auth requise)',
        'POST /api/v2/sellers': 'Créer un vendeur (auth requise)',
        'PATCH /api/v2/sellers/:id': 'Modifier un vendeur (auth requise)',
        'DELETE /api/v2/sellers/:id': 'Supprimer un vendeur (auth requise)'
      }
    }
  })
}

