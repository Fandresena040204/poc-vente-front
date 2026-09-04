# TODO — Frontend POC Ventes (branchement sur le backend Django)

Ce dépôt est une **copie** du template [Admin-template](https://github.com/Fandresena040204/Admin-template)
(shadcn-admin) — le template d'origine n'est pas modifié, tout le travail
spécifique au POC se fait ici.

Objectif : brancher ce template sur le backend `poc-vente-back`, avec une
interface pour **toutes** les ressources : Customers, Products, Ventes
(+ VenteLigne), Users, Roles et permissions (ces 3 dernières réservées aux
rôles qui en ont le droit).

Convention de suivi identique au backend : ce fichier plutôt que des issues
GitHub, mis à jour au fil des PRs.

## Constat sur le template (analyse)

- Stack déjà alignée avec `Docs AI.md` (TanStack partout, shadcn/ui) — rien à
  changer côté outillage.
- **Auth actuellement mockée** (`features/auth/sign-in`, `sign-up`) : aucun
  appel réseau, juste un faux token en cookie. À reconnecter entièrement.
- **`features/users/`** = pattern CRUD complet et réutilisable (table +
  colonnes + dialogs create/edit/delete/bulk-delete + provider de state) →
  gabarit à répliquer pour Customers/Products/Ventes/Roles.
- **`features/customers`** et **`features/pages/role-based-access.tsx`** sont
  des démos avec données statiques en dur — utiles comme inspiration UI (la
  matrice de permissions en particulier), mais à reconstruire avec de vraies
  données API, pas à réutiliser tel quel.
- Pas de garde de route sur `_authenticated` (`beforeLoad`) : n'importe qui
  accède aux pages sans être connecté.
- Pas de `.env`/`VITE_API_BASE_URL`, pas d'instance axios configurée avec
  baseURL + intercepteur Authorization + refresh token.
- `sidebar-data.ts` contient beaucoup de sections démo sans rapport avec le
  POC (mail, kanban, chats, ecommerce, blog, tickets, invoices, charts,
  tables, widgets, icônes...) à nettoyer/masquer.

## Phase 0 — Fondations (bloquant pour tout le reste)

- [ ] `.env.example` + `.env` avec `VITE_API_BASE_URL=http://localhost:8000`
- [ ] Instance axios centralisée (`lib/api-client.ts`) : baseURL, header
      `Authorization: Bearer <access>`, intercepteur de refresh automatique
      sur 401 (`/api/token/refresh/`), déconnexion si le refresh échoue
- [ ] Réécrire `stores/auth-store.ts` : `user` réel (id, username, email,
      roles: string[]), `accessToken` + `refreshToken`, plus plusieurs rôles
      possibles (pas un seul `role: string`)
- [ ] Brancher `sign-in` sur `POST /api/token/` (+ `GET /api/auth/me/` pour
      récupérer `roles`)
- [ ] Brancher `sign-up` sur `POST /api/auth/register/`
- [ ] Garde de route sur `_authenticated` (`beforeLoad`) : redirection vers
      `/sign-in` si pas de token
- [ ] Helper de permission côté UI (`hasRole('admin')`,
      `hasPermission('change_vente')`) pour masquer boutons/routes — la
      vraie barrière reste le backend, ceci est cosmétique
- [ ] Nettoyer `sidebar-data.ts` : retirer les sections démo, garder
      Dashboard, Ventes, Products, Customers, Users, Roles
- [ ] Page `/settings` → profil réel (`GET/PATCH /api/auth/me/`)

## Phase 1 — Customers (CRUD simple, sert de 2e gabarit après Users)

- [ ] Types + schema zod alignés sur `CustomerSerializer` (id string `CUS...`,
      name, email, phone, created_at, updated_at)
- [ ] Hooks TanStack Query : `useCustomers`, `useCreateCustomer`,
      `useUpdateCustomer`, `useDeleteCustomer` (`/api/customers/`)
- [ ] Table + colonnes + dialogs create/edit/delete (sur le modèle
      `features/users/components/*`)
- [ ] Masquer le bouton Supprimer si l'utilisateur n'a pas `delete_customer`

## Phase 2 — Products (CRUD simple, même gabarit que Customers)

- [ ] Types + schema zod (id `PRD...`, name, sku, default_price)
- [ ] Hooks + table + dialogs (`/api/products/`)

## Phase 3 — Ventes (le plus complexe : lignes imbriquées + FSM)

- [ ] Types + schema zod pour `Vente` et `VenteLigne` (statuts
      draft/validated/cancelled)
- [ ] Hooks : `useVentes` (avec filtres `status`/`customer`),
      `useVente(id)`, `useCreateVente`, `useUpdateVente`
- [ ] Formulaire de création avec éditeur de lignes dynamique (ajout/suppression
      de lignes produit+quantité+prix, `react-hook-form` `useFieldArray`)
- [ ] Sélecteurs Customer/Product en recherche/autocomplete (pas de simple
      `<select>` si la liste grandit)
- [ ] Table des ventes avec badge de statut, filtre par statut
- [ ] Bouton "Valider" (`POST /api/ventes/{id}/valider/`, visible seulement
      si `status=draft` et permission `change_vente`)
- [ ] Bouton "Annuler" (`POST /api/ventes/{id}/annuler/`, visible seulement
      si `status=validated` et permission `change_vente`)

## Phase 4 — Users (adapter le gabarit existant aux vraies données)

- [ ] Remplacer les données mock de `features/users` par
      `GET /api/users/` (réservé rôle `admin`)
- [ ] Retirer la création/suppression d'utilisateur (n'existe pas côté API,
      la création passe par `/api/auth/register/`) — garder lecture +
      gestion des rôles
- [ ] UI d'assignation de rôle par utilisateur (multi-select, un appel
      `assign_role`/`remove_role` par rôle ajouté/retiré)
- [ ] Route visible/accessible seulement si l'utilisateur a le rôle `admin`

## Phase 5 — Roles et permissions (réservé au rôle `admin`)

- [ ] CRUD des rôles (`/api/roles/`) sur le gabarit Users/Customers
- [ ] Page "matrice de permissions" (inspirée de
      `features/pages/role-based-access.tsx`, mais connectée à l'API) :
      lignes = permissions (`view/add/change/delete` × `customer/product/
      vente`), colonnes = rôles, checkbox = présence dans `role.permissions`
- [ ] Sauvegarde : `PATCH /api/roles/{id}/` avec la liste complète de
      `permissions` (remplace tout, cf. doc backend)

## Phase 6 — Polish / cohérence globale

- [ ] Masquage cohérent des entrées de sidebar selon rôle/permission
- [ ] Page 403 (`errors/forbidden`) branchée quand l'API renvoie 403 sur une
      action tentée
- [ ] Vérifier que 401 → déconnexion + redirection fonctionne réellement
      (pas seulement pour l'access token expiré, aussi refresh expiré)
- [ ] Revue rapide : plus aucune donnée mock affichée dans les pages qu'on a
      branchées
- [ ] Tester chaque rôle par défaut (`admin`, `editor`, `user`) dans l'UI
      réelle pour confirmer que les permissions se comportent comme prévu

## Hors périmètre pour l'instant

- Toutes les autres features démo du template (mail, kanban, chats,
  ecommerce, blog, tickets, invoices, calendar, charts, tables, widgets) —
  laissées inutilisées dans le code, pas supprimées (au cas où utile plus
  tard), juste retirées de la sidebar.
