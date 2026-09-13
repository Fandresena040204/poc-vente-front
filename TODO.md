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

## Phase 8 — Fondations CRUD réutilisables + système de Champ (2026-09-05, pilote)

Suite à un constat de duplication massive (~15 fichiers quasi identiques par
ressource), première brique de généralisation posée et validée sur un
pilote à 2 ressources — voir GUIDE_DEVELOPPEUR.md pour la doc destinée aux
développeurs (mis à jour à faire séparément).

- [x] `src/lib/crud/` : `createResourceApi`/`createResourceHooks` (fabrique
      CRUD standard + `createActionHook` pour les actions custom type
      valider/annuler), `entityBase`/`decimalString` (schéma zod partagé).
- [x] `src/hooks/use-delete-dialog-state.ts` + `src/components/crud/
      resource-delete-dialog.tsx` : remplacent le trio provider+dialogs+
      delete-dialog par ressource (Add/Edit sont des pages depuis la Phase
      6, il ne restait que Delete à gérer — state local au lieu d'un
      Context React).
- [x] `src/components/layout/data/crud-menu-item.ts` : entrée sidebar
      Liste/Saisie en 1 ligne au lieu de ~10 (appliqué à Ventes/Products/
      Customers).
- [x] `src/lib/fields/` + `src/components/fields/` : système de "Champ"
      (`FieldDescriptor`) réutilisable en formulaire — types
      text/number/date/datetime/select, `dependsOn`+`options` (select
      dépendant), `dependsOn`+`compute` (valeur calculée), `fillsFields`
      (remplissage en cascade à la sélection). Nouveau `SelectCombobox`
      (Popover+cmdk, avec recherche) remplace `SelectDropdown` pour ces
      nouveaux champs. Décision de conception : généraliser au niveau du
      Champ plutôt que du formulaire entier, pour éviter la complexité
      d'un "form builder" générique (combobox dépendants, autocomplete en
      cascade, valeurs par défaut dynamiques).
- [x] **Pilote Products** : migré sur les fondations CRUD (provider/
      dialogs/delete-dialog supprimés, colonnes/table en factory avec
      `onDelete` en prop plutôt que Context). ~16 fichiers → ~8.
- [x] **Pilote Ventes.lines** : le champ `product` de chaque ligne utilise
      `FieldDescriptor` (type `select` + `fillsFields`) — sélectionner un
      produit remplit maintenant automatiquement `unit_price` avec son
      prix par défaut (comportement absent avant, il fallait le retaper).
      Vérifié en navigateur : création d'une vente, prix auto-rempli à la
      sélection du produit, montant correct après sauvegarde.
- [x] Vérifié : build + `tsc`, lint (0 erreur, mêmes 3 warnings
      pré-existants), 141 tests verts, vérification manuelle en
      navigateur (Products CRUD complet, Ventes avec auto-remplissage,
      delete générique testé sur Products/Ventes/Customers).
- [x] Limite connue (documentée dans `field-descriptor.ts`) — une
      `defaultValue` dynamique sur un champ `select` avec `fillsFields` ne
      déclenche pas encore la cascade automatiquement au montage. **Résolu
      le 2026-09-12** (voir entrée ci-dessous).
- [x] **Migration complète** (2026-09-05, suite) : Customers, Ventes
      (hors lignes déjà faites), Users et Roles basculés sur les
      fondations CRUD.
      - Customers/Ventes : même pattern que Products (schema/api/hooks
        allégés, colonnes en factory avec `onDelete`, provider/dialogs/
        delete-dialog supprimés au profit de `useDeleteDialogState` +
        `ResourceDeleteDialog`). Ventes garde `toPayload` (reformatage des
        lignes) et expose `useValiderVente`/`useAnnulerVente` via le
        nouveau `createActionHook`.
      - Users : pas de create/update/delete côté API (création via
        `/auth/register`) — seul `fetchAllPages` (extrait de
        `create-resource-api.ts`) est réutilisé pour `fetchAllUsers`.
        Contexte `UsersProvider` remplacé par un état local dans
        `Users` (`useState`), pattern identique à `useDeleteDialogState`
        mais pour le dialog "Manage roles" (pas une suppression).
      - Roles : create/update/delete migrés sur les fondations. Le
        dialog d'ajout (`RolesCreateDialog`) reste un simple modal (hors
        périmètre de la refonte Saisie=page, toujours volontairement un
        champ unique). `ResourceDeleteDialog` étendu avec un `extraNote`
        optionnel pour conserver l'avertissement spécifique ("Users
        currently holding this role will lose the permissions...").
      - Tests des anciens `*-delete-dialog.test.tsx` (Products/Roles/
        Ventes) supprimés, couverts par le test générique
        `resource-delete-dialog.test.tsx` ; `roles-permission-matrix.
        test.tsx` adapté (prop `onDelete` au lieu du Provider).
      - Vérifié : build + `tsc`, lint (0 erreur), 131 tests verts (141 −
        10 tests de dialogs supprimés), vérification manuelle en
        navigateur sur Customers/Ventes/Users/Roles (CRUD, delete
        générique, Manage roles, Valider/Annuler, matrice de
        permissions) — état des données réelles restauré après test.
- [x] **Adoption complète du système de Champ** (2026-09-05, suite) :
      toutes les briques génériques sont maintenant réellement utilisées,
      plus seulement écrites.
      - `RenderFormField` : formulaires Products, Customers, Ventes
        (champ `customer` en plus des lignes déjà faites) et le dialog
        `RolesCreateDialog` réécrits sous forme de tableaux de
        `FieldDescriptor` itérés, au lieu de `FormField`/`Input` recopiés
        à la main. Nouveau `layout: 'grid-label'` sur `RenderFormField`
        pour reproduire exactement la mise en page existante (label
        aligné à droite sur 2 colonnes + champ sur 4) ; `autoComplete`
        ajouté au descripteur pour préserver le comportement d'origine.
      - `renderColumn`/`getDisplayValue` : toutes les colonnes de
        Products/Customers/Ventes/Users réécrites via des
        `FieldDescriptor` + `renderColumn`, y compris les rendus custom
        (Badge de statut Ventes, Badge Actif/Inactif et rôles de Users,
        `LongText` tronqué) via un nouveau champ `render` optionnel sur
        `FieldDescriptor` (delegation totale du rendu de cellule).
        `renderColumn` accepte aussi `columnDef` pour fusionner les
        options TanStack Table (`enableSorting`, `enableHiding`,
        `filterFn`) sans les faire porter par le descripteur.
      - **Démonstration `clickable`/`linkTo`** : la colonne "Customer" de
        la liste des Ventes est maintenant cliquable et navigue vers la
        fiche du client (`/customers/saisie/$id`) — premier usage réel de
        cette capacité dans le projet.
      - Vérifié : build + `tsc`, lint (0 erreur), 131 tests verts
        (inchangés, preuve que le comportement est resté identique après
        le passage aux composants génériques). Vérification manuelle en
        navigateur non concluante cette session (instabilité de
        l'automatisation Chrome, sans rapport avec le code — à vérifier
        visuellement par l'utilisateur si besoin).
- [x] **Cascade `fillsFields` au montage** (2026-09-12) : `useFieldDependencies`
      applique désormais, une seule fois au montage et dès que les options
      sont résolues, le patch `fillsFields` d'un champ `select` si sa valeur
      initiale correspond à une option connue — mais uniquement sur les
      champs cibles encore vides. Le champ `defaultValue` du descripteur
      (jamais lu nulle part, mort depuis le départ) est supprimé au passage :
      la valeur initiale réelle vient toujours des `defaultValues` de
      react-hook-form. Contrainte "ne jamais écraser une valeur déjà
      persistée" ajoutée après coup : la première version écrasait le
      `unit_price` sauvegardé d'une ligne de vente en édition avec le prix
      par défaut *actuel* du produit dès l'ouverture du formulaire (régression
      détectée par `ventes-form.test.tsx`, corrigée en ne remplissant que les
      champs vides). Vérifié : build, lint, 131 tests verts.
- [x] **Roles : Saisie en page dédiée** (2026-09-12) : le dialog modal
      `RolesCreateDialog` est remplacé par le même pattern Liste/Saisie que
      Products/Customers/Ventes — `RolesForm` (composant de formulaire nu,
      ex-contenu du dialog) + `RolesSaisie` (page, `src/features/roles/
      saisie.tsx`) + route `roles/saisie/index.tsx` (gardée par `hasRole
      ('admin')` comme la liste). `RolesPrimaryButtons` devient un `Link`
      gated par `hasPermission('add_role')` (plus de prop `onAdd`/état local
      dans `Roles`). Sidebar : entrée "Roles" basculée sur `crudMenuItem`
      comme les autres ressources (permissions `view_role`/`add_role` au
      lieu du gating `role: 'admin'` au niveau du groupe). Pas de page
      d'édition (`$id`) : Roles n'a jamais eu de flux "modifier le nom", seule
      la matrice de permissions et la suppression existent après création.
      Ancien test `roles-create-dialog.test.tsx` remplacé par
      `roles-form.test.tsx`. Vérifié : build, lint, 131 tests verts (3
      supprimés + 3 ajoutés = compte inchangé).
- [x] **Bug régression corrigé** (2026-09-13) : le passage de Roles sur
      `crudMenuItem` a fait disparaître l'entrée "Roles" du menu pour tout
      le monde, y compris l'admin. Cause : `RoleViewSet`/`UserViewSet` côté
      backend sont protégés par `IsAdminRole` (vérifie directement
      `role='admin'`), pas par le système générique `HasRolePermission` +
      codenames — `view_role`/`add_role` ne sont donc jamais assignés à
      personne (voir README backend, section permissions). `crudMenuItem`
      gate désormais un 5e paramètre optionnel `gateByRole` : si fourni,
      les sous-items "Liste"/"Saisie" utilisent `role` (via `hasRole`) au
      lieu de `permission` (via `hasPermission`). Appliqué à Roles avec
      `gateByRole: 'admin'`. `RolesPrimaryButtons` avait la même erreur
      (`hasPermission('add_role')`) — corrigé en `hasRole('admin')`.
      Vérifié : build, lint, 131 tests verts.
- [x] **Suppression des pages de démo du template** (2026-09-13) : toutes
      les features et routes du template shadcn-admin jamais reliées à la
      sidebar réelle ont été supprimées (~116 fichiers) — `apps`, `blog`,
      `calendar`, `charts`, `chats`, `contacts`, `dashboards` (variante
      démo, à ne pas confondre avec `dashboard` singulier, le vrai tableau
      de bord servi sur `/`), `ecommerce`, `icons`, `invoices`, `kanban`,
      `mail`, `orders`, `pages`, `profile` (page `/profile` morte : le menu
      utilisateur pointait déjà vers `/settings`), `tables`, `tasks`,
      `tickets`, `ui-elements`, `widgets` — côté `src/features/*` et
      `src/routes/_authenticated/*`. Vérifié avant suppression : aucune
      référence croisée depuis le code réel (`grep` sur les imports),
      `command-menu.tsx` dérive ses entrées de `sidebar-data.ts` donc rien
      à y nettoyer. Après suppression : build (bundle largement plus léger,
      l'avertissement "chunk > 500kB" disparaît), lint (0 erreur), 115
      tests verts (131 − 16, les tests propres à la feature `tasks`
      supprimée).

- [x] **`ResourceRowActions` générique** (2026-09-13) : le menu "⋮" (Edit/
      Delete) de chaque ligne de liste était recopié à l'identique dans
      `products/components/data-table-row-actions.tsx` et
      `customers/components/data-table-row-actions.tsx` (seuls le type, la
      route et le codename de permission changeaient), et Ventes avait la
      même chose plus ses actions Valider/Annuler. Factorisé dans
      `src/components/crud/resource-row-actions.tsx`
      (`{ resourceKey, editTo, editParams, onDelete, extraActions? }`,
      permissions `change_<resourceKey>`/`delete_<resourceKey>` dérivées
      automatiquement). Les 3 fichiers `data-table-row-actions.tsx`
      deviennent de simples wrappers ; celui de Ventes passe ses actions
      Valider/Annuler via `extraActions` (rendu avant Edit/Delete avec son
      propre séparateur). `users/components/data-table-row-actions.tsx`
      non concerné : pas d'Edit/Delete, juste un bouton "Manage roles",
      forme trop différente pour partager ce composant. Vérifié : build,
      lint, 115 tests verts (inchangé).

- [x] **`ResourceDataTable` générique + suppression de 6 fichiers** (2026-09-13) :
      retour utilisateur — trop de petits fichiers par ressource, difficile à
      reproduire pour un autre développeur (ex: `products-table.tsx` faisait
      ~155 lignes presque entièrement de plomberie TanStack Table recopiée à
      l'identique dans `customers-table.tsx`/`ventes-table.tsx`/
      `users-table.tsx`). Factorisé dans
      `src/components/crud/resource-data-table.tsx` (état tri/pagination/
      colonnes visibles, câblage `useTableUrlState`, rendu table+pagination) —
      ne prend que `columns` déjà construites + config toolbar/filtres en
      props. Les 4 fichiers `*-table.tsx` sont supprimés ; chaque `index.tsx`
      construit ses `columns` via `useMemo` (logique déjà présente avant,
      juste déplacée) et rend `<ResourceDataTable>` directement.
      Au passage : `hasPermission` n'étant pas un hook (lit
      `useAuthStore.getState()`), `ResourceRowActions` peut être appelé
      directement dans la cellule `actions` d'un `ColumnDef` sans fichier
      wrapper — supprimé `products/components/data-table-row-actions.tsx`
      et `customers/components/data-table-row-actions.tsx`, inlinés dans
      leurs `*-columns.tsx`. Ventes et Users gardent leur wrapper : logique
      propre non-boilerplate (Valider/Annuler avec hooks dédiés pour Ventes,
      bouton "Manage roles" sans rapport avec Edit/Delete pour Users).
      Bilan : Products/Customers passent de 9 à 7 fichiers chacun. Vérifié :
      build, lint (0 erreur), 115 tests verts (inchangé — aucun test ne
      ciblait directement les anciens `*-table.tsx`).
- [x] **`*-table.tsx` restauré, mais fin** (2026-09-13) : retour utilisateur
      sur l'étape précédente — supprimer `products-table.tsx` etc. et tout
      inliner dans `index.tsx` prive chaque ressource d'un endroit dédié pour
      une future personnalisation de table (sélection de lignes, bouton
      toolbar en plus, export...) sans alourdir `index.tsx` ni polluer
      `ResourceDataTable` avec des props spécifiques à une seule ressource.
      `products-table.tsx`/`customers-table.tsx`/`ventes-table.tsx`/
      `users-table.tsx` réintroduits, mais réduits à ~20-50 lignes chacun
      (construisent `columns` via `useMemo` + appellent `ResourceDataTable`
      avec leur config toolbar/filtres) au lieu des ~155 lignes d'origine.
      `index.tsx` redevient `<ProductsTable data={...} search={...}
      navigate={...} onDelete={requestDelete} />` comme avant l'étape
      précédente. Vérifié : build, lint, 115 tests verts.

- [x] **Filtres par intervalle (number/date/datetime)** (2026-09-13) : jusqu'ici
      seuls 2 types de filtre existaient (recherche texte substring, et
      sélection multiple exacte via `DataTableFacetedFilter` pour Ventes.status
      et Users.roles) — aucune opération numérique/date (entre, ≥, ≤).
      Ajouté en 4 briques génériques, réutilisables sur n'importe quelle
      ressource :
      - `src/lib/fields/range-filter-fn.ts` — `rangeFilterFn(type)` : `FilterFn`
        TanStack Table comparant la valeur de la ligne à `{ min, max }`
        (bornes incluses, chacune optionnelle ; nombres via `parseFloat`,
        dates via `Date`).
      - `src/components/data-table/range-filter.tsx` — `DataTableRangeFilter`,
        popover toolbar avec deux `Input` (min/max), pendant de
        `DataTableFacetedFilter` pour une valeur continue plutôt que discrète.
      - `DataTableToolbar` : nouvelle prop `rangeFilters` (rendus après les
        `filters` existants) ; `ResourceDataTable` la relaie via
        `toolbar.rangeFilters`.
      - `useTableUrlState` : nouvelle entrée `columnFilters` de type `'range'`
        (`minSearchKey`/`maxSearchKey`) — sérialise `{min,max}` dans deux
        query params distincts au lieu d'un seul, sans toucher au
        comportement existant des types `'string'`/`'array'`.
      - **Démonstration concrète** : colonne "Created" (`created_at`) ajoutée
        à la liste Products avec un filtre par intervalle de dates
        (`products-columns.tsx`/`products-table.tsx`) — jusqu'ici aucune
        ressource n'affichait de colonne date/datetime en liste.
      - Tests ajoutés : `range-filter-fn.test.ts` (9 cas : bornes number/date,
        valeurs manquantes, instance `Date`) et 2 cas dans
        `use-table-url-state.test.ts` (lecture + écriture de la config
        `'range'`). Vérifié : build, lint (0 erreur), 126 tests verts (115 +
        11 nouveaux).

- [x] **Filtre texte en popup nommé** (2026-09-13) : retour utilisateur — le
      champ de recherche libre (`<Input placeholder='Filter products...'>`)
      ne montre pas sur quelle colonne il filtre, contrairement au filtre
      Status des Ventes (popup avec un bouton nommé "Status"). Remplacé par
      `DataTableTextFilter` (`src/components/data-table/text-filter.tsx`) —
      même style bouton+popup que `DataTableFacetedFilter`/
      `DataTableRangeFilter` : bouton nommé d'après le champ (`searchTitle`,
      ex: "Name", "Username"), badge affichant la valeur active, popover
      avec l'input à l'intérieur. `DataTableToolbar`/`ResourceDataTable`
      gagnent la prop `searchTitle` (Products/Customers → "Name",
      Users → "Username"). Ventes n'est pas concerné : il n'utilisait déjà
      que des popups (`filters`), pas de recherche texte libre. Vérifié :
      build, lint (0 erreur), 126 tests verts (inchangé).

- [x] **Filtres/tri/pagination délégués au backend** (2026-09-13) : jusqu'ici
      `fetchAll`/`fetchAllPages` ramenait TOUTE la ressource en mémoire et
      TanStack Table filtrait/triait/paginait côté client — problématique à
      l'échelle (une vraie base ne doit pas être rapatriée en entier pour
      afficher 10 lignes). Le backend a déjà l'essentiel de la plomberie DRF
      (`DjangoFilterBackend`/`SearchFilter`/`OrderingFilter`, voir TODO
      backend) ; côté frontend :
      - `createResourceApi` gagne `fetchList(params)` (une page filtrée/
        triée par le serveur) ; `fetchAll` reste inchangé pour les besoins
        "liste complète" (selects de Ventes, `useRoles()`, matrice de
        permissions).
      - `createResourceHooks` gagne `useListPage(params)`
        (`placeholderData: keepPreviousData` pour éviter un flash "0
        résultat" pendant le chargement d'une nouvelle page/filtre) ;
        `useList` inchangé. Users (pas de `createResourceApi`, custom)
        reçoit l'équivalent manuel `fetchUsersPage`/`useUsersPage`.
      - `ResourceDataTable` devient entièrement "contrôlé" :
        `manualFiltering`/`manualSorting`/`manualPagination: true` +
        `pageCount` fourni par l'appelant ; ne construit plus l'état lui-même
        (`useTableUrlState` déplacé vers l'appelant). Effet de bord : les
        badges de compte par option des filtres popup (`getFacetedUniqueValues`)
        ont disparu (pertinents seulement sur un jeu de données déjà en
        mémoire, pas sur une page serveur).
      - Nouveau `src/lib/crud/column-filters.ts` (`getColumnFilterValue`,
        `buildOrdering`) — évite de répéter la lecture de `columnFilters`/la
        construction du paramètre `ordering` dans chaque `*-table.tsx`.
      - Les 4 `*-table.tsx` (Products/Customers/Ventes/Users) appellent
        eux-mêmes `useTableUrlState` + `useListPage`/`useUsersPage`, gèrent
        leur loader/erreur (déplacé depuis `index.tsx`), et traduisent leurs
        filtres UI en paramètres backend (texte libre → `search` générique ;
        Ventes.status/Users.roles, multi-sélection → valeur jointe par
        virgule ; Products.created_at → `created_at_min`/`created_at_max`).
      - `index.tsx` de chaque ressource s'allège : ne fetch plus la liste
        affichée lui-même, rend directement `<XxxTable search={...}
        navigate={...} onDelete={...} />` (Ventes/Users gardent un fetch
        complet — customers/roles — pour leurs besoins propres : selects,
        options de filtre).
      - Vérifié : build, lint (0 erreur), 126 tests verts (inchangé — le
        comportement client testé, ex. `use-table-url-state.test.ts`, ne
        change pas de forme). **Vérification manuelle en navigateur
        concluante cette fois** (contrairement à d'autres passes de cette
        session) : `GET /api/products/?page=1&page_size=10`,
        `...&search=Souris` (résultat correctement filtré à 1 ligne),
        `...&created_at_min=2020-01-01&created_at_max=2020-12-31`
        ("No results.", plage hors données réelles) — confirmés via
        l'onglet réseau du navigateur, requêtes réelles vers le backend
        Django, pas du filtrage en mémoire.

- [x] **Bouton "Search" — filtres appliqués seulement au clic** (2026-09-13) :
      retour utilisateur — écrire dans un popup de filtre (texte, intervalle)
      appelait le backend à chaque frappe. Séparé l'état de filtre en deux :
      `columnFilters` (ce qui est affiché/en cours de saisie dans les popups,
      change immédiatement) et un nouvel `appliedFilters` local par table
      (ne change qu'au clic sur "Search", et c'est lui seul qui alimente
      `useListPage`). `DataTableToolbar` gagne un bouton "Search" optionnel
      (prop `onSearch`, rendu après les filtres/avant "Reset") ;
      `ResourceDataTable` le relaie. Les 4 `*-table.tsx` initialisent
      `appliedFilters` depuis `columnFilters` (une URL partagée/filtrée reste
      donc active sans clic requis) et l'appliquent via
      `onSearch: () => setAppliedFilters(columnFilters)`. Pagination et tri
      restent immédiats (ce sont des clics discrets, pas une saisie continue)
      — seuls les filtres (texte/popup/intervalle) sont différés. Vérifié en
      navigateur réel (onglet réseau) : taper "Souris" dans le filtre "Name"
      ne déclenche **aucune** requête ; cliquer "Search" déclenche exactement
      `GET /api/products/?page=1&page_size=10&search=Souris`, résultat
      correctement filtré. Build, lint, 126 tests verts (inchangé).

## Hors périmètre pour l'instant

- Les composants UI génériques de `src/components/ui/` (shadcn) n'ont pas
  été audités un par un pour un usage résiduel — certains peuvent être
  restés inutilisés après la purge des démos ; laissés en l'état
  (scaffolding bon marché à garder, régénérable via la CLI shadcn).
