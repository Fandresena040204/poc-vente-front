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

- [x] Vérification navigateur E2E complète sur toutes les features
      ensemble (auth, CRUD × 5, permissions par rôle) — faite le 2026-09-04 :
      Customers/Products/Ventes CRUD, cycle FSM complet Draft → Validated →
      Cancelled, gestion des rôles utilisateur, matrice de permissions
      (create/toggle/delete), et gating `user` role (view+add uniquement,
      pas de bouton Edit/Delete, 403 sur les ressources non autorisées) —
      tout confirmé conforme au comportement attendu. Nettoyage des
      données de test effectué (customer/product/vente de test supprimés).
      Note : un compte de test `e2euser` (rôle `user`) reste en base, créé
      pendant le test — pas de fonctionnalité de suppression d'utilisateur
      dans l'app (attendu, cf. Phase 4).
- [x] Masquage cohérent des entrées de sidebar selon rôle/permission —
      implémenté le 2026-09-04 : chaque `NavItem` peut porter `permission`
      (vérifié via `hasPermission`) ou `role` (vérifié via `hasRole`) dans
      `sidebar-data.ts` ; `AppSidebar` filtre `navGroups` en conséquence et
      retire les groupes devenus vides (`Administration` disparaît entièrement
      pour un non-admin). Vérifié en conditions réelles : retrait de
      `view_customer` au rôle `user` fait disparaître "Customers" de la
      sidebar (plus de lien mort vers une erreur "Failed to load
      customers") ; permission restaurée après test.
- [ ] Page 403 (`errors/forbidden`) branchée quand l'API renvoie 403 sur une
      action tentée (redirection déjà en place pour `/users` et `/roles`
      côté route ; à vérifier aussi pour une action refusée en cours de
      session, pas seulement à la navigation)
- [ ] Vérifier que 401 → déconnexion + redirection fonctionne réellement
      (pas seulement pour l'access token expiré, aussi refresh expiré)
- [x] Revue rapide : plus aucune donnée mock affichée dans les pages qu'on a
      branchées — corrigé le 2026-09-04 : le menu compte en haut à droite
      (`profile-dropdown.tsx`) et le pied de sidebar (`nav-user.tsx`)
      affichent maintenant `auth-store.user` réel (nom/prénom ou username,
      email, initiales), au lieu de "Fandresena" en dur ; items
      "Billing"/"New Team"/"Upgrade to Pro" (sans backend) retirés
- [x] Tester chaque rôle par défaut (`admin`, `editor`, `user`) dans l'UI
      réelle pour confirmer que les permissions se comportent comme prévu
      — `admin` et `user` vérifiés le 2026-09-04 (voir ci-dessus) ; `editor`
      non testé explicitement mais suit le même mécanisme de gating
- [x] Page `/settings` → profil réel (`GET/PATCH /api/auth/me/`) — implémenté
      le 2026-09-04 : `ProfileForm` charge `username`/`first_name`/
      `last_name`/`email` depuis `auth-store.user`, `username` en lecture
      seule, sauvegarde via `PATCH /api/auth/me/` (`updateMe` dans
      `features/auth/api.ts`, déjà supporté côté backend sans changement),
      met à jour `auth-store` + toast au succès. Champs bio/URLs (mock,
      non supportés par le backend) retirés.
- [ ] CI GitHub Actions — `.github/workflows/ci.yml` prêt mais pas encore
      poussé (le token `gh` manque le scope `workflow`)

### Déconnexion — déjà implémentée (confirmé le 2026-09-04)

`SignOutDialog` (`src/components/sign-out-dialog.tsx`) appelle
`auth.reset()` (efface `user`/tokens + cookies `access_token`/
`refresh_token`) puis redirige vers `/sign-in?redirect=<page actuelle>`.
Déclenché depuis `profile-dropdown.tsx` (header) et `nav-user.tsx` (pied de
sidebar). Fonctionnait déjà correctement avant cette session ; seul
l'affichage du nom/email dans ces deux menus était mock (corrigé
ci-dessus).

## Phase 7 — Pages dédiées Create/Edit + sous-menus Liste/Saisie (2026-09-05)

- [x] Remplacement des popups de création/édition par de vraies pages pour
      Customers, Products et Ventes : formulaire extrait dans
      `*-form.tsx` (sans wrapper `Dialog`), monté par une page
      `features/<resource>/saisie.tsx` (Header+Main+Form), avec boutons
      Cancel/Save. La suppression reste un dialog de confirmation
      (`*-delete-dialog.tsx`, inchangé).
- [x] Nouvelles routes `routes/_authenticated/<resource>/saisie/index.tsx`
      (création, `/x/saisie`) et `saisie/$id.tsx` (édition, `/x/saisie/$id`,
      cherche la ligne dans le cache TanStack Query de `useX()` par id).
      Note technique : les fichiers plats `saisie.tsx` + `saisie.$id.tsx`
      sont nestés (parent/enfant) par TanStack Router à cause de la
      notation par points — obligatoire de les mettre dans un dossier
      `saisie/` (`index.tsx` + `$id.tsx`) pour qu'ils restent deux routes
      indépendantes.
- [x] Sidebar : Ventes/Products/Customers sont devenus des `NavCollapsible`
      avec sous-items "Liste" (`permission: view_x`) et "Saisie"
      (`permission: add_x`). Filtrage de `app-sidebar.tsx` étendu pour
      descendre récursivement dans les sous-items et masquer le parent si
      tous ses enfants sont masqués.
- [x] Boutons "Add X" et action "Edit" du menu ⋮ remplacés par des
      `Link`/navigation vers `/x/saisie` et `/x/saisie/$id` au lieu de
      `setOpen('add'|'edit')`. Provider de chaque feature réduit au seul
      état `'delete'`.
- [x] Tests des anciens `*-action-dialog.test.tsx` migrés vers
      `*-form.test.tsx` (mêmes cas : validation, création, édition,
      + nouveau cas Cancel). Suite complète (141 tests) verte, build et
      lint (warnings pré-existants uniquement) OK. Vérifié en navigateur :
      create/edit Customers, Products, Ventes (avec lignes dynamiques),
      sous-menus visibles selon permission, delete inchangé.

### Header mutualisé dans AuthenticatedLayout (2026-09-05)

- [x] Le `<Header fixed>` (Search/ThemeSwitch/ConfigDrawer/ProfileDropdown)
      était dupliqué à l'identique dans les 49 fichiers de `src/features/*`
      qui en avaient besoin — hérité tel quel du template shadcn-admin.
      Déplacé une seule fois dans `AuthenticatedLayout`
      (`src/components/layout/authenticated-layout.tsx`), rendu au-dessus
      de l'`<Outlet/>`, juste après la sidebar. Bloc `<Header>` et ses 5
      imports retirés des 49 pages concernées (script perl, formatage
      Prettier ensuite). Le `Dashboard` perdait son `TopNav` (liens de
      démo non fonctionnels, 3 sur 4 `disabled`) — supprimé avec sa
      constante `topNav`, sans perte réelle de fonctionnalité. Vérifié :
      build + `tsc`, lint (mêmes 3 warnings pré-existants), 141 tests
      verts.

## Hors périmètre pour l'instant

- Toutes les autres features démo du template (mail, kanban, chats,
  ecommerce, blog, tickets, invoices, calendar, charts, tables, widgets) —
  laissées inutilisées dans le code, pas supprimées (au cas où utile plus
  tard), juste retirées de la sidebar.
