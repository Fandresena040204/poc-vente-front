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

- [x] `.env.example` + `.env` avec `VITE_API_BASE_URL=http://localhost:8000`
- [x] Instance axios centralisée (`lib/api-client.ts`) : baseURL, header
      `Authorization: Bearer <access>`, intercepteur de refresh automatique
      sur 401 (`/api/token/refresh/`), déconnexion si le refresh échoue
- [x] Réécrire `stores/auth-store.ts` : `user` réel (id, username, email,
      roles: string[], permissions: string[]), `accessToken` + `refreshToken`
- [x] Brancher `sign-in` sur `POST /api/token/` (+ `GET /api/auth/me/` pour
      récupérer `roles`/`permissions`)
- [x] Brancher `sign-up` sur `POST /api/auth/register/`
- [x] Garde de route sur `_authenticated` (`beforeLoad`) : redirection vers
      `/sign-in` si pas de token
- [x] Helper de permission côté UI (`hasRole('admin')`,
      `hasPermission('change_vente')`) — nécessite le champ `permissions`
      ajouté à `/api/auth/me/` côté backend (PR séparée)
- [x] Nettoyer `sidebar-data.ts` : retirer les sections démo, garder
      Dashboard, Ventes, Products, Customers, Users, Roles, Settings, Errors
- [ ] CI GitHub Actions : `.github/workflows/ci.yml` prêt mais pas encore
      poussé (le token `gh` manque le scope `workflow`)
- [ ] Page `/settings` → profil réel (`GET/PATCH /api/auth/me/`)

## Phase 1 — Customers ✅ (CRUD simple, sert de 2e gabarit après Users)

- [x] Types + schema zod alignés sur `CustomerSerializer` (id string `CUS...`,
      name, email, phone, created_at, updated_at)
- [x] Hooks TanStack Query : `useCustomers`, `useCreateCustomer`,
      `useUpdateCustomer`, `useDeleteCustomer` (`/api/customers/`)
- [x] Table + colonnes + dialogs create/edit/delete (sur le modèle
      `features/users/components/*`)
- [x] Masquer Add/Edit/Delete selon `add_customer`/`change_customer`/
      `delete_customer` — vérifié avec un compte réel au rôle `user`
- [x] Bonus (découvert en testant) : fix de l'hydratation de `user` après un
      rechargement de page complet (voir `_authenticated/route.tsx`)

## Phase 2 — Products ✅ (CRUD simple, même gabarit que Customers)

- [x] Types + schema zod (id `PRD...`, name, sku, default_price)
- [x] Hooks + table + dialogs (`/api/products/`)

## Phase 3 — Ventes ✅ (le plus complexe : lignes imbriquées + FSM)

- [x] Types + schema zod pour `Vente` et `VenteLigne` (statuts
      draft/validated/cancelled)
- [x] Hooks : `useVentes`, `useCreateVente`, `useUpdateVente`,
      `useDeleteVente`, `useValiderVente`, `useAnnulerVente`
- [x] Formulaire de création avec éditeur de lignes dynamique
      (`react-hook-form` `useFieldArray`, ajout/suppression de lignes)
- [x] Sélecteurs Customer/Product (réutilisent `useCustomers()`/
      `useProducts()` des features existantes)
- [x] Table des ventes avec badge de statut, filtre par statut, jointure
      client-side customer id → nom
- [x] Actions "Valider"/"Annuler" dans le menu de ligne, visibles selon le
      statut ET `hasPermission('change_vente')`

## Phase 4 — Users ✅ (adapté aux vraies données)

- [x] `GET /api/users/` réel (réservé rôle `admin`)
- [x] Ancienne démo (create/edit/delete/invite/bulk-delete) entièrement
      retirée — n'existe pas côté API, création via `/api/auth/register/`
- [x] Dialogue de gestion des rôles (checkboxes, diff avant/après, un appel
      `assign_role`/`remove_role` par rôle réellement modifié)
- [x] Route `/users` gardée par `hasRole('admin')`, redirige vers
      `/errors/forbidden` sinon

## Phase 5 — Roles et permissions ✅ (réservé au rôle `admin`)

- [x] CRUD des rôles (`/api/roles/`) : création (nom), suppression
      (confirmation par saisie du nom)
- [x] Page "matrice de permissions" (inspirée de
      `features/pages/role-based-access.tsx`, connectée à l'API réelle) :
      rôles en colonnes, permissions (`view/add/change/delete` ×
      `customer/product/vente`) en lignes groupées par ressource
- [x] Sauvegarde immédiate au toggle : `PATCH /api/roles/{id}/` avec la
      liste complète de `permissions` (remplace tout, cf. doc backend)
- [x] Route `/roles` gardée par `hasRole('admin')`

## Phase 6 — Polish / cohérence globale (en cours)

- [ ] Vérification navigateur E2E complète sur toutes les features
      ensemble (auth, CRUD × 5, permissions par rôle) — reportée
      volontairement à la fin de toutes les phases pour ne pas répéter le
      cycle de test manuel à chaque étape
- [ ] Masquage cohérent des entrées de sidebar selon rôle/permission
- [ ] Page 403 (`errors/forbidden`) branchée quand l'API renvoie 403 sur une
      action tentée (redirection déjà en place pour `/users` et `/roles`
      côté route ; à vérifier aussi pour une action refusée en cours de
      session, pas seulement à la navigation)
- [ ] Vérifier que 401 → déconnexion + redirection fonctionne réellement
      (pas seulement pour l'access token expiré, aussi refresh expiré)
- [ ] Revue rapide : plus aucune donnée mock affichée dans les pages qu'on a
      branchées
- [ ] Tester chaque rôle par défaut (`admin`, `editor`, `user`) dans l'UI
      réelle pour confirmer que les permissions se comportent comme prévu
- [ ] Page `/settings` → profil réel (`GET/PATCH /api/auth/me/`) — reporté
      de la Phase 0
- [ ] CI GitHub Actions — `.github/workflows/ci.yml` prêt mais pas encore
      poussé (le token `gh` manque le scope `workflow`)

## Hors périmètre pour l'instant

- Toutes les autres features démo du template (mail, kanban, chats,
  ecommerce, blog, tickets, invoices, calendar, charts, tables, widgets) —
  laissées inutilisées dans le code, pas supprimées (au cas où utile plus
  tard), juste retirées de la sidebar.
