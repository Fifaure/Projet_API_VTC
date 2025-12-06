# 🚗 API VTC - Plateforme de Gestion Automobile

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**Une API REST complète pour la gestion de véhicules, vendeurs et modèles automobiles avec intégration IA**

[🚀 Démarrage rapide](#-installation) • [📚 Documentation API](#-documentation-api) • [🤖 Assistant IA](#-intégration-ia-groq)

</div>

---

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📚 Documentation API](#-documentation-api)
- [🔐 Authentification](#-authentification)
- [🤖 Intégration IA (Groq)](#-intégration-ia-groq)
- [🎨 Interface Utilisateur](#-interface-utilisateur)
- [🛡️ Sécurité](#️-sécurité)
- [📦 Structure du Projet](#-structure-du-projet)

---

## ✨ Fonctionnalités

### 🔧 API REST
- **API versionnée** (v1 et v2) avec endpoints RESTful complets
- **CRUD complet** sur Véhicules, Modèles, Vendeurs et Utilisateurs
- **Rate Limiting** : 20 requêtes/minute par IP
- **Documentation automatique** des endpoints

### 🔐 Authentification & Sécurité
- **JWT** avec Access Token (30s) + Refresh Token (7 jours)
- **Système de rôles** : USER et ADMIN
- **Hachage bcrypt** des mots de passe
- **Routes protégées** avec middleware d'authentification

### 🤖 Intelligence Artificielle
- **Chat IA intégré** propulsé par Groq (via OpenRouter)
- **Génération de descriptions** de véhicules
- **Estimation de prix** automobile
- **Assistant vendeur** spécialisé

### 🎨 Interface Moderne
- **Design responsive** avec Tailwind CSS
- **Interface CRUD** complète pour toutes les entités
- **Chat IA popup** accessible depuis la navbar
- **Thème sombre** élégant pour le chat

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │  Tailwind   │  │   React Components  │  │
│  │   App Dir   │  │     CSS     │  │   (CRUD + Chat IA)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                      API ROUTES                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  API v1  │  │  API v2  │  │   Auth   │  │   AI (Groq) │  │
│  │  (Basic) │  │  (JWT)   │  │   JWT    │  │  OpenRouter │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                      MIDDLEWARE                              │
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │   Rate Limiter  │  │   Auth Middleware (JWT verify)  │   │
│  │   20 req/min    │  │   Role-based access control     │   │
│  └─────────────────┘  └─────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                       DATABASE                               │
│  ┌─────────────┐  ┌─────────────────────────────────────┐   │
│  │   Prisma    │  │           PostgreSQL                │   │
│  │    ORM      │  │  Users, Vehicles, Models, Sellers   │   │
│  └─────────────┘  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prérequis

- **Node.js** >= 18.18.0
- **PostgreSQL** >= 14
- **npm** ou **yarn**

### Étapes d'installation

```bash
# 1. Cloner le projet
git clone <repository-url>
cd Projet_API_VTC

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 4. Générer le client Prisma
npm run prisma:generate

# 5. Appliquer les migrations
npm run prisma:migrate

# 6. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

---

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/projet_api_vtc?schema=public"

# Clé API OpenRouter (pour l'IA Groq)
OPENROUTER_API_KEY="sk-or-v1-votre-cle-api"

# (Optionnel) Modèle IA à utiliser
OPENROUTER_MODEL="meta-llama/llama-3.3-70b-instruct"
```

### Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer en mode développement |
| `npm run build` | Compiler pour la production |
| `npm run start` | Démarrer en production |
| `npm run lint` | Vérifier le code |
| `npm run prisma:generate` | Générer le client Prisma |
| `npm run prisma:migrate` | Appliquer les migrations |
| `npm run prisma:studio` | Ouvrir Prisma Studio |

---

## 📚 Documentation API

### Vue d'ensemble des versions

| Version | Description | Authentification |
|---------|-------------|------------------|
| **v1** | API basique | Session simple |
| **v2** | API complète | JWT + Refresh Token |

### 🔷 API v2 (Recommandée)

#### Authentification

```bash
# Inscription
POST /api/v1/auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "name": "John Doe"
}

# Connexion
POST /api/v2/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
# Retourne: { accessToken, refreshToken, user }

# Rafraîchir le token
POST /api/v2/auth/refresh
Content-Type: application/json
{
  "refreshToken": "votre-refresh-token"
}

# Déconnexion
POST /api/v2/auth/logout
Authorization: Bearer <accessToken>
```

#### Véhicules

```bash
# Liste des véhicules (public)
GET /api/v2/vehicles

# Détail d'un véhicule (public)
GET /api/v2/vehicles/:id

# Créer un véhicule (auth requise)
POST /api/v2/vehicles
Authorization: Bearer <accessToken>
Content-Type: application/json
{
  "modelId": "clxxxx",
  "sellerId": "clxxxx",
  "mileageKm": 45000,
  "priceEUR": 15000,
  "color": "Bleu",
  "notes": "Excellent état"
}

# Modifier un véhicule (auth requise)
PATCH /api/v2/vehicles/:id
Authorization: Bearer <accessToken>

# Supprimer un véhicule (auth requise)
DELETE /api/v2/vehicles/:id
Authorization: Bearer <accessToken>
```

#### Modèles

```bash
GET    /api/v2/models          # Liste (public)
GET    /api/v2/models/:id      # Détail (public)
POST   /api/v2/models          # Créer (auth)
PATCH  /api/v2/models/:id      # Modifier (auth)
DELETE /api/v2/models/:id      # Supprimer (auth)
```

#### Vendeurs

```bash
GET    /api/v2/sellers         # Liste (public)
GET    /api/v2/sellers/:id     # Détail (public)
POST   /api/v2/sellers         # Créer (auth)
PATCH  /api/v2/sellers/:id     # Modifier (auth)
DELETE /api/v2/sellers/:id     # Supprimer (auth)
```

#### Administration (ADMIN only)

```bash
GET    /api/v2/admin/users     # Liste des utilisateurs
GET    /api/v2/admin/users/:id # Détail utilisateur
PATCH  /api/v2/admin/users/:id # Modifier utilisateur
DELETE /api/v2/admin/users/:id # Supprimer utilisateur
```

---

## 🔐 Authentification

### Système JWT

L'API v2 utilise un système de double token :

| Token | Durée | Usage |
|-------|-------|-------|
| **Access Token** | 30 secondes | Authentifier les requêtes API |
| **Refresh Token** | 7 jours | Obtenir un nouveau Access Token |

### Utilisation

```javascript
// Exemple avec fetch
const response = await fetch('/api/v2/vehicles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(vehicleData)
});
```

### Rôles

| Rôle | Permissions |
|------|-------------|
| `USER` | CRUD sur véhicules, modèles, vendeurs |
| `ADMIN` | Tout + gestion des utilisateurs |

---

## 🤖 Intégration IA (Groq)

### Configuration

L'IA utilise **Groq** via **OpenRouter** pour des réponses ultra-rapides.

```env
OPENROUTER_API_KEY="sk-or-v1-votre-cle"
OPENROUTER_MODEL="meta-llama/llama-3.3-70b-instruct"
```

### Modèles disponibles

| Modèle | Description |
|--------|-------------|
| `meta-llama/llama-3.3-70b-instruct` | Puissant (défaut) |
| `meta-llama/llama-3.1-8b-instant` | Ultra-rapide |
| `mistralai/mixtral-8x7b-instruct` | Bon équilibre |

### Endpoints IA

```bash
# Chat libre
POST /api/v1/ai
{
  "action": "chat",
  "messages": [{"role": "user", "content": "Bonjour !"}]
}

# Générer une description de véhicule
POST /api/v1/ai
{
  "action": "description",
  "vehicle": {
    "brand": "Peugeot",
    "model": "308",
    "year": 2022,
    "mileage": 30000
  }
}

# Estimer un prix
POST /api/v1/ai
{
  "action": "estimate",
  "vehicle": {
    "brand": "Renault",
    "model": "Clio",
    "year": 2020,
    "mileage": 45000
  }
}

# Assistant vendeur
POST /api/v1/ai
{
  "action": "assistant",
  "question": "Comment négocier avec un client hésitant ?"
}
```

### Interface Chat

Un chat IA est accessible depuis le bouton **"Groq AI"** dans la navbar. Il supporte :
- 💬 Conversation libre
- 📝 Markdown (gras, italique, code)
- 💡 Suggestions de questions
- 🗑️ Effacement de l'historique

---

## 🎨 Interface Utilisateur

### Pages principales

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/login` | Connexion |
| `/register` | Inscription |
| `/home` | Dashboard principal |
| `/home?mode=vehicles` | Gestion des véhicules |
| `/home?mode=models` | Gestion des modèles |
| `/home?mode=sellers` | Gestion des vendeurs (admin) |
| `/home?mode=users` | Gestion des utilisateurs (admin) |

### Fonctionnalités CRUD

Chaque entité dispose d'une interface complète :
- ✅ Liste avec pagination
- ✅ Création via formulaire
- ✅ Édition
- ✅ Suppression avec confirmation

---

## 🛡️ Sécurité

### Mesures implémentées

| Mesure | Description |
|--------|-------------|
| **Rate Limiting** | 20 requêtes/minute par IP |
| **JWT sécurisé** | Tokens signés avec expiration courte |
| **Bcrypt** | Hachage des mots de passe (salt rounds: 10) |
| **CORS** | Configuration restrictive |
| **Validation** | Validation des entrées utilisateur |

### Headers de sécurité

Chaque réponse API inclut :
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 1234567890
```

---

## 📦 Structure du Projet

```
Projet_API_VTC/
├── app/
│   ├── (pages)/                 # Pages frontend
│   │   ├── home/                # Dashboard
│   │   │   ├── Navbar.tsx
│   │   │   ├── GrokChat.tsx     # Chat IA
│   │   │   └── page.tsx
│   │   ├── login/
│   │   ├── register/
│   │   └── CRUD/                # Interfaces CRUD
│   │       ├── vehicles/
│   │       ├── models/
│   │       ├── sellers/
│   │       └── users/
│   ├── api/                     # Routes API
│   │   ├── v1/                  # API v1
│   │   │   ├── ai/              # Endpoints IA
│   │   │   ├── auth/
│   │   │   ├── vehicles/
│   │   │   ├── models/
│   │   │   └── sellers/
│   │   └── v2/                  # API v2 (JWT)
│   │       ├── auth/
│   │       ├── admin/
│   │       ├── vehicles/
│   │       ├── models/
│   │       └── sellers/
│   ├── lib/                     # Utilitaires
│   │   ├── auth.ts              # Gestion JWT
│   │   ├── authMiddleware.ts
│   │   ├── grok.ts              # Service IA
│   │   └── prisma.ts            # Client DB
│   └── generated/prisma/        # Client Prisma généré
├── prisma/
│   ├── schema.prisma            # Schéma DB
│   └── migrations/              # Migrations
├── middleware.ts                # Rate limiting
├── package.json
└── README.md
```

---

## 📊 Schéma de Base de Données

```prisma
model User {
  id           String   @id
  email        String   @unique
  passwordHash String
  role         Role     @default(USER)  // USER | ADMIN
  name         String?
  refreshToken String?
}

model Vehicle {
  id        String   @id
  modelId   String
  sellerId  String?
  mileageKm Int?
  priceEUR  Decimal?
  color     String?
  notes     String?
  model     Model    @relation
  seller    Seller?  @relation
}

model Model {
  id        String    @id
  name      String
  brand     String
  yearStart Int?
  yearEnd   Int?
  vehicles  Vehicle[]
}

model Seller {
  id       String    @id
  name     String
  email    String?   @unique
  phone    String?
  website  String?
  vehicles Vehicle[]
}
```

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

<div align="center">

**Développé avec ❤️ pour le projet B3 API**

</div>
