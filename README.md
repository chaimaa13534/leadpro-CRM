# LeadPro CRM — Frontend

CRM SaaS pour équipes commerciales (leads, opportunités, pipeline, contacts). Ce dépôt contient le **frontend React** du produit.

> Semaine 1 terminée : fondations, architecture, Design System, Layout applicatif, Dashboard (données simulées) et authentification (session simulée) sont en place. Aucun module métier (Leads, Contacts, Companies…) n'est encore développé — c'est l'objet de la Semaine 2.

---

## Sommaire

- [Présentation](#présentation)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Scripts disponibles](#scripts-disponibles)
- [Structure des dossiers](#structure-des-dossiers)
- [Convention de nommage](#convention-de-nommage)
- [Guide de développement](#guide-de-développement)
- [Bonnes pratiques](#bonnes-pratiques)
- [Feuille de route](#feuille-de-route)

---

## Présentation

LeadPro CRM aide une équipe commerciale à suivre ses leads, son pipeline d'opportunités et son activité au quotidien. Le produit s'inspire de la rigueur de Stripe Dashboard, de la sobriété de Linear et de la clarté de Notion — sans copier aucune interface existante.

Toutes les données affichées aujourd'hui sont **simulées** (voir `src/mocks/`) : aucune API réelle n'est encore branchée. L'architecture des services (`src/services/`) est conçue pour qu'un futur remplacement par de vrais appels HTTP ne change aucune signature côté composants.

## Technologies

| Catégorie | Choix | Pourquoi |
|---|---|---|
| Framework | React 19 + TypeScript (strict) | Écosystème mature, typage bout en bout |
| Build | Vite 8 | Démarrage et HMR quasi instantanés |
| Style | Tailwind CSS v4 (CSS-first, `@theme`) | Design System entièrement piloté par variables CSS |
| Routing | React Router v7 | Data router, routes imbriquées, lazy loading natif |
| Formulaires | React Hook Form + Zod | Validation déclarative, performant (pas de re-render par frappe) |
| Animations | Framer Motion | Réservé aux transitions qui apportent une vraie valeur (montage/démontage) |
| Icônes | Lucide React | Cohérentes, légères, tree-shakables |
| Graphiques | Recharts | Composants graphiques déclaratifs, thème piloté par nos couleurs |
| Qualité | ESLint (flat config) + Prettier + TypeScript strict | Zéro erreur, zéro warning tolérés |

Aucun state manager externe (Redux, Zustand…) : l'état global tient sur quelques Contexts React légers (voir [Architecture](#architecture)).

## Architecture

### État global — Context, pas de librairie

Quatre "slices" dans `src/store/slices/`, chacune avec son Context + Provider + hook dédié (`src/hooks/useXxx.ts`) :

| Slice | Rôle | Portée |
|---|---|---|
| `theme-context` | Thème clair/sombre, persisté en `localStorage` | Toute l'app (`App.tsx`) |
| `auth-context` | Session utilisateur simulée, persistée en `localStorage` | Toute l'app (`App.tsx`) |
| `notification-context` | Notifications "toast" | Toute l'app (`App.tsx`) |
| `layout-context` | Sidebar réduite/étendue, Drawer mobile | `MainLayout` uniquement |

Chaque Context est scindé en deux fichiers (`xxx-context.ts` pour la définition, `XxxProvider.tsx` pour le composant) : un fichier qui mélange export de composant et export de valeur casse le Fast Refresh de Vite (avertissement ESLint `react-refresh/only-export-components`).

### Couche données — mocks → services → hooks/composants

```
mocks/ (données factices, typées)
  ↓
services/ (CRUD simulé, délai réseau artificiel, Promises)
  ↓
hooks/ ou composants (consomment les services)
```

Les services de listes (`lead.service.ts`, `contact.service.ts`…) s'appuient sur une fabrique générique (`lib/create-mock-crud-service.ts`) plutôt que de dupliquer la pagination/création/suppression dans chaque fichier. Remplacer les mocks par une vraie API ne touchera que `services/`.

### Routing — layouts + garde-fous

```
router.tsx
├── ProtectedRoute (redirige vers /login si pas de session)
│    └── MainLayout (Sidebar + Topbar + Footer)
│         └── Dashboard, Leads, Contacts… (lazy pour Dashboard, cf. Recharts)
├── PublicRoute (redirige vers / si déjà connecté)
│    └── AuthLayout
│         └── Login, Forgot/Reset Password
└── /403, /500, * (404) — routes d'erreur, hors layout
```

### Design System — tokens, pas de valeurs codées en dur

Toutes les couleurs, tailles de police, rayons, ombres, espacements et breakpoints vivent dans `src/styles/global.css` via la directive `@theme` de Tailwind v4. Le mode sombre redéfinit uniquement les tokens *sémantiques* (`--color-background`, `--color-text-primary`…) sous `.dark` — la palette brute ne change jamais. Aucun composant ne doit contenir de couleur hexadécimale codée en dur (exception : `lib/constants/colors.constants.ts`, qui expose ces mêmes valeurs pour les contextes non-CSS comme Recharts).

## Installation

Prérequis : **Node.js ≥ 22.12** (validé avec Node 24.18 LTS — voir `.nvmrc`).

```bash
npm install
npm run dev
```

L'application est servie sur `http://localhost:5173`.

**Compte de démonstration** (aucun backend, session simulée) :
`alex.martin@leadpro.io` / `Demo1234!`
`sara.idrissi@leadpro.io`/ `Demo1234!`

## Scripts disponibles

| Script | Description |
|---|---|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Vérifie les types puis build de production |
| `npm run preview` | Prévisualise le build de production en local |
| `npm run lint` | Analyse le code avec ESLint |
| `npm run lint:fix` | Corrige automatiquement les problèmes ESLint |
| `npm run format` | Formate tout le code avec Prettier |
| `npm run format:check` | Vérifie le formatage sans modifier les fichiers |
| `npm run typecheck` | Vérifie les types TypeScript sans générer de build |

Avant toute pull request : `npm run typecheck && npm run lint && npm run format:check && npm run build` doivent tous réussir sans erreur ni avertissement.

## Structure des dossiers

```
src/
├── assets/            Images, polices, fichiers statiques importés dans le code
├── components/
│   ├── auth/           Composants spécifiques à l'authentification (AuthCard, PasswordInput…)
│   ├── common/          Composants partagés entre features, non génériques (PageTransition…)
│   ├── errors/           ErrorBoundary, ErrorPage (base des pages 403/404/500)
│   ├── layout/           Sidebar, Topbar, Breadcrumb, MobileDrawer…
│   └── ui/                Design System : Button, Input, Card, Modal, Skeletons, Toast…
├── features/            Un dossier par module métier (leads, contacts, dashboard, auth…),
│                         chacun avec son propre sous-dossier `components/`
├── hooks/               Hooks réutilisables (useAuth, useTheme, useLayout, useNotifications…)
├── layouts/              MainLayout (app authentifiée), AuthLayout (écrans publics)
├── lib/
│   ├── constants/        Valeurs figées partagées (routes, couleurs, statuts, navigation…)
│   ├── cn.ts              Fusion de classNames (clsx + tailwind-merge)
│   ├── zod-resolver.ts    Adaptateur Zod → React Hook Form (fait maison)
│   └── ...
├── mocks/                Données factices, typées contre `types/`
├── pages/                Un composant minimal par route
├── routes/               Configuration du routeur, ProtectedRoute, PublicRoute
├── schemas/              Schémas de validation Zod (un fichier par formulaire)
├── services/             Accès aux données — simulé aujourd'hui, remplaçable par une API
├── store/slices/         Contexts globaux (voir Architecture ci-dessus)
├── styles/               `global.css` — tokens du Design System
├── types/                Modèles TypeScript partagés
└── utils/                Fonctions utilitaires pures (formatDate, debounce, getInitials…)
```

## Convention de nommage

- **Composants** : `PascalCase.tsx`, un composant principal par fichier (`Button.tsx` exporte `Button`).
- **Hooks** : `useXxx.ts`, toujours préfixés `use`.
- **Types/interfaces** : `PascalCase`, fichiers en `xxx.types.ts` (ex: `user.types.ts` exporte `User`, `UserRole`…).
- **Schémas Zod** : `xxxSchema` (variable) dans `xxx.schema.ts`, type inféré exporté en `XxxFormValues`.
- **Constantes** : `SCREAMING_SNAKE_CASE` pour les valeurs, `PascalCase` pour les objets de configuration (`ROUTES`, `COLORS`).
- **Mocks** : `xxxMock` (ex: `leadsMock`) dans `xxx.mock.ts`.
- **Contexts** : `xxx-context.ts` (kebab-case, définition seule) + `XxxProvider.tsx` (composant).
- **Alias d'import** : toujours `@/...` (jamais de chemins relatifs `../../..`), configuré dans `vite.config.ts` et `tsconfig.app.json`.
- **Barrels (`index.ts`)** : présents dans chaque dossier pour lister ce qu'il contient, mais l'import direct (`@/services/auth.service` plutôt que `@/services`) est **préféré** partout où le tree-shaking / code-splitting compte (voir la note sur `DashboardPage` ci-dessous).

## Guide de développement

### Ajouter un nouveau composant UI générique

1. Créer `src/components/ui/MonComposant.tsx`.
2. Utiliser uniquement des tokens du Design System (`bg-primary-600`, jamais `bg-[#4451e6]`).
3. `forwardRef` si le composant enveloppe un élément de formulaire natif (voir `Input.tsx`).
4. Ajouter l'export dans `src/components/ui/index.ts`.

### Ajouter un module métier (Semaine 2)

Chaque domaine (`leads`, `contacts`…) a déjà son dossier dans `src/features/` et sa page dans `src/pages/`. Pour démarrer un module :

1. Définir/compléter le type dans `src/types/xxx.types.ts` (souvent déjà présent).
2. Écrire le schéma de validation dans `src/schemas/xxx.schema.ts` si le module a un formulaire.
3. Construire les composants dans `src/features/xxx/components/`.
4. Utiliser les services existants (`src/services/xxx.service.ts`) — déjà prêts en CRUD simulé.
5. Composer la page dans `src/pages/XxxPage.tsx`.

### Ajouter une route protégée

Toute nouvelle route métier va sous `MainLayout` dans `router.tsx`, donc automatiquement protégée par `ProtectedRoute`. Si elle doit être publique, l'ajouter sous `PublicRoute` + `AuthLayout` à la place.

### Déclencher une notification

```ts
import { useNotifications } from '@/hooks/useNotifications';

const { success, error } = useNotifications();
success('Lead créé avec succès.');
```

## Bonnes pratiques

- **TypeScript strict partout** : `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters` sont actifs — le projet doit compiler sans erreur ni avertissement.
- **Aucune couleur codée en dur** dans un composant : toujours une classe Tailwind (`text-danger-600`) ou, pour un contexte non-CSS (Recharts…), `lib/constants/colors.constants.ts`.
- **Accessibilité non négociable** : tout bouton icône seul a un `aria-label`, tout élément interactif est atteignable au clavier, le focus visible n'est jamais supprimé (`:focus-visible` global dans `styles/global.css`).
- **Framer Motion avec parcimonie** : réservé aux transitions de montage/démontage (`AnimatePresence`) où l'animation apporte une vraie valeur perçue (Modal, Drawer, Toast). Un simple changement de largeur (Sidebar) reste en CSS pur.
- **`React.memo`/`useMemo`/`useCallback` seulement si mesurablement utiles** : le projet ne contient pas encore de liste volumineuse ; ces optimisations seront introduites en Semaine 2 quand les tableaux Leads/Contacts géreront de vrais volumes de données.
- **Un composant, une responsabilité** : au-delà d'une taille raisonnable ou de plusieurs responsabilités mélangées, découper (voir `features/dashboard/components/`, aucun fichier au-dessus de ~110 lignes).
- **Le code n'est jamais laissé incomplet** : pas de `TODO`, pas de pseudo-code — un fichier commencé est un fichier terminé.

## Feuille de route

**Semaine 1 (terminée)** — Jours 1 à 7 : fondations, architecture, Design System, Layout, Dashboard (simulé), authentification (simulée), consolidation.

**Semaine 2 (à venir)** — modules métier : Leads, Contacts, Companies, Opportunities, Pipeline (Kanban complet), Calendar, Reports, Notifications, Settings. Les dossiers `src/features/*/` correspondants existent déjà, vides, prêts à être remplis.
