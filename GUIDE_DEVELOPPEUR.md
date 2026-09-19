# Guide développeur — Frontend

Ce guide explique comment étendre le frontend : ajouter un item de menu,
une ressource complète (liste filtrée/triée/paginée côté serveur +
formulaire de saisie), une route. Il ne couvre que le **frontend**
(`poc-vente-front`) — pour le backend, voir `GUIDE_DEVELOPPEUR.md` dans le
dépôt `poc-django-tanstack`.

Pour l'installation et le lancement, voir `README.md`. Pour l'utilisation
de l'app une fois connecté, voir `GUIDE_UTILISATION.md`.

Les exemples reprennent la ressource `Product` (la plus simple des
ressources en place : Customers, Products, Ventes, Users, Roles) comme
fil rouge — pour une ressource avec des lignes imbriquées et des champs
dépendants, s'inspirer plutôt de `Ventes` (customer/produit/lignes).

## Principe général : fondations génériques + fichiers spécifiques

Tout ce qui est **identique d'une ressource à l'autre** (plomberie
TanStack Table, dialog de suppression, menu d'actions Edit/Delete, entrée
de sidebar, appels CRUD basiques) vit dans des fondations partagées
(`src/lib/crud/`, `src/lib/fields/`, `src/components/crud/`,
`src/components/fields/`, `src/components/data-table/`). Tout ce qui est
**spécifique à une ressource** (quels champs, quel libellé, quel filtre)
reste écrit à la main dans le dossier de la feature — jamais généralisé,
puisque c'est justement la partie qui varie.

```
src/features/products/
├── api.ts                              # createResourceApi (§ 2.2)
├── hooks.ts                            # createResourceHooks (§ 2.3)
├── index.tsx                           # page "Liste" (chrome + delete dialog)
├── saisie.tsx                          # page "Saisie" (create + edit)
├── data/
│   └── schema.ts                       # types + schémas zod (§ 2.1)
└── components/
    ├── products-primary-buttons.tsx    # bouton "Add Product"
    ├── products-form.tsx               # formulaire (§ 2.5)
    ├── products-columns.tsx            # colonnes du tableau (§ 2.4)
    └── products-table.tsx              # tableau : requête + filtres (§ 2.6)
```

---

## 1. Ajouter un item de menu / sous-menu

La sidebar est définie dans `src/components/layout/data/sidebar-data.ts`.
Pour une ressource CRUD standard (Liste + Saisie), utiliser le helper
`crudMenuItem` plutôt qu'écrire l'entrée à la main :

```ts
// src/components/layout/data/crud-menu-item.ts
crudMenuItem('Products', Package, 'product', '/products')
// -> { title: 'Products', icon: Package, items: [
//      { title: 'Liste', url: '/products', permission: 'view_product' },
//      { title: 'Saisie', url: '/products/saisie', permission: 'add_product' },
//    ] }
```

`resourceKey` (`'product'`) doit être le nom du modèle Django en
minuscules — les permissions générées (`view_product`/`add_product`)
doivent correspondre exactement aux codenames Django (voir le guide
backend § 5).

**Cas particulier** : si la ressource n'est pas protégée par le système
générique de permissions côté backend mais par un rôle direct
(`IsAdminRole`, ex. Roles/Users), passer `gateByRole` :

```ts
crudMenuItem('Roles', ShieldCheck, 'role', '/roles', 'admin')
```

Sans ça, l'entrée de menu resterait invisible pour tout le monde — les
codenames `view_role`/`add_role` ne sont jamais assignés à personne
puisque le backend ne vérifie pas ces permissions pour cette ressource
(piège réellement rencontré sur ce projet, voir `TODO.md`).

Pour un lien simple (pas de sous-menu Liste/Saisie), déclarer l'item à la
main : `{ title: 'Settings', url: '/settings', icon: Settings }`.
`permission`/`role` sont optionnels sur n'importe quel item ; un item sans
l'un ou l'autre est toujours visible. Le filtrage réel se fait dans
`src/components/layout/app-sidebar.tsx` (`getVisibleNavGroups`) — pas
besoin d'y toucher pour un nouvel item.

---

## 2. Créer une ressource (liste + saisie)

### 2.1. `data/schema.ts` — types et validation

Utiliser `entityBase` (ajoute `id`/`created_at`/`updated_at`, le
`created_at`/`updated_at` étant coercés en `Date`) et `decimalString`
(regex partagée pour les montants/quantités DRF, ex: `"19.99"`) :

```ts
import { z } from 'zod'
import { decimalString, entityBase } from '@/lib/crud/entity-schema'

const _productSchema = z.object({
  ...entityBase,
  name: z.string(),
  sku: z.string(),
  default_price: z.string(),
})
export type Product = z.infer<typeof _productSchema>

export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  sku: z.string().min(1, 'SKU is required.'),
  default_price: decimalString({ required: 'Default price is required.' }),
})
export type ProductForm = z.infer<typeof productFormSchema>
```

### 2.2. `api.ts` — appels HTTP

`createResourceApi<TEntity, TForm>(endpoint, options?)` fabrique les 5
appels standard :

```ts
import { createResourceApi } from '@/lib/crud/create-resource-api'
import { type Product, type ProductForm } from './data/schema'

export const productsApi = createResourceApi<Product, ProductForm>('/api/products/')
```

- `fetchAll()` — boucle sur la pagination DRF et ramène **toute** la
  ressource. Réservé aux besoins qui ont vraiment besoin de l'ensemble
  complet : options d'un `select` (ex. la liste des clients pour le
  formulaire Ventes), résolution id → libellé (ex. le nom du client dans
  la colonne Ventes), matrice de permissions.
- `fetchList(params)` — **une page** filtrée/triée par le serveur
  (`{ page, pageSize, ordering?, search?, filters? }` →
  `{ count, next, previous, results }`). C'est celui-ci qu'utilise
  l'affichage de la liste (§ 2.6) — ne jamais utiliser `fetchAll` pour
  peupler un tableau, ça chargerait toute la table en mémoire.
- `create`/`update`/`delete` — standard, avec `toPayload` optionnel dans
  les `options` si le payload envoyé diffère du form (ex. Ventes
  reformate ses lignes imbriquées, voir `ventes/api.ts`).

Si la ressource n'a pas de create/update/delete côté API (ex. Users, créé
via `/auth/register`), ne pas utiliser `createResourceApi` — écrire les
fonctions nécessaires à la main dans `api.ts` (voir `users/api.ts`,
`fetchAllUsers`/`fetchUsersPage` calquées sur le même modèle).

### 2.3. `hooks.ts` — hooks TanStack Query

`createResourceHooks(queryKey, api, { entityLabel })` fabrique les hooks
correspondants (invalidation de cache + toast automatiques sur les
mutations) :

```ts
import { createResourceHooks } from '@/lib/crud/create-resource-hooks'
import { productsApi } from './api'

const PRODUCTS_QUERY_KEY = ['products']

export const {
  useList: useProducts,           // fetchAll — pour les besoins "liste complète"
  useListPage: useProductsPage,   // fetchList(params) — pour l'affichage paginé
  useCreate: useCreateProduct,
  useUpdate: useUpdateProduct,
  useDelete: useDeleteProduct,
} = createResourceHooks(PRODUCTS_QUERY_KEY, productsApi, { entityLabel: 'Product' })
```

Pour une action métier custom (ex. `Valider`/`Annuler` sur Vente),
`createActionHook(queryKey, fn, successMessage)` donne le même
comportement (invalidation + toast) sans imposer de forme particulière à
`fn` — voir `ventes/hooks.ts`.

### 2.4. Le système de Champ — décrire un champ une seule fois

`FieldDescriptor<TValues>` (`src/lib/fields/field-descriptor.ts`) décrit
un champ **une fois**, réutilisé à la fois en formulaire
(`RenderFormField`) et en colonne de liste (`renderColumn`) :

```ts
type FieldDescriptor<TValues> = {
  name: string; label: string
  type: 'text' | 'number' | 'date' | 'datetime' | 'select'
  placeholder?: string; autoComplete?: string
  options?: FieldOption[] | ((deps) => FieldOption[] | Promise<FieldOption[]>)
  dependsOn?: string[]
  fillsFields?: (selected: FieldOption) => Record<string, unknown>
  compute?: (deps) => unknown
  clickable?: boolean; linkTo?: (row: TValues) => { to: string; params? }
  render?: (row: TValues) => ReactNode
}
```

Pourquoi ne pas juste faire un "form builder" générique qui prend une
liste de champs et rend le formulaire entier ? Parce qu'un vrai
formulaire a besoin de cas trop spécifiques (comboboxes dépendants,
remplissage en cascade, mise en page particulière) pour qu'un moteur
générique reste simple — la complexité est donc portée **par le champ
lui-même** (`dependsOn`/`fillsFields`/`compute`/`render`), pas par un
composant monolithique qui devrait tout prévoir à l'avance. Chaque
formulaire/tableau reste écrit à la main, juste avec moins de
répétition sur la définition de chaque champ.

Deux mécanismes de dépendance distincts :
- **`dependsOn` + `options`** — filtrer les choix d'un select selon un
  autre champ.
- **`dependsOn` + `compute`** — calculer une valeur (ex. un sous-total)
  à chaque changement d'une dépendance.
- **`fillsFields`** — au choix d'une option, patcher d'autres champs du
  formulaire (ex. sélectionner un produit remplit `unit_price` avec son
  prix par défaut) :

  ```ts
  // ventes-form.tsx — ligne de vente
  {
    name: `lines.${index}.product`, label: 'Product', type: 'select',
    options: productOptions,
    fillsFields: (selected) => ({
      [`lines.${index}.unit_price`]: (selected.data as Product).default_price,
    }),
  }
  ```

  La cascade se déclenche aussi **au montage** si le champ a déjà une
  valeur correspondant à une option connue (ex. rouvrir une ligne en
  édition) — mais seulement sur les champs cibles encore vides, pour ne
  jamais écraser une valeur déjà persistée.

### 2.5. `components/products-form.tsx` — formulaire

Un tableau de `FieldDescriptor` + `RenderFormField` par champ :

```tsx
const PRODUCT_FIELDS: FieldDescriptor<ProductForm>[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Clavier mécanique', autoComplete: 'off' },
  { name: 'sku', label: 'SKU', type: 'text', placeholder: 'SKU-001', autoComplete: 'off' },
  { name: 'default_price', label: 'Default price', type: 'number', placeholder: '19.99' },
]

export function ProductsForm({ currentRow, onSuccess, onCancel }: ProductsFormProps) {
  const isEdit = !!currentRow
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEdit
      ? { name: currentRow.name, sku: currentRow.sku, default_price: currentRow.default_price }
      : { name: '', sku: '', default_price: '' },
  })

  function onSubmit(values: ProductForm) {
    const mutation = isEdit
      ? updateProduct.mutateAsync({ id: currentRow.id, payload: values })
      : createProduct.mutateAsync(values)
    mutation.then(() => { form.reset(); onSuccess() })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-xl space-y-4'>
        {PRODUCT_FIELDS.map((field) => (
          <RenderFormField key={field.name} descriptor={field} form={form} layout='grid-label' />
        ))}
        <div className='flex justify-end gap-2 pt-2'>
          <Button type='button' variant='outline' onClick={onCancel}>Cancel</Button>
          <Button type='submit'>Save changes</Button>
        </div>
      </form>
    </Form>
  )
}
```

`layout='grid-label'` reproduit la mise en page label-à-droite/champ sur
4 colonnes utilisée partout. `hideLabel` masque le label (utile dans une
ligne répétable où une seule en-tête suffit, voir les lignes de Ventes).

### 2.6. `components/products-columns.tsx` — colonnes de la liste

Un `FieldDescriptor` par colonne + `renderColumn`, plus une colonne
`actions` avec `ResourceRowActions` (menu Edit/Delete générique) :

```tsx
const NAME_FIELD: FieldDescriptor<Product> = {
  name: 'name', label: 'Name', type: 'text',
  render: (row) => <LongText className='max-w-48'>{row.name}</LongText>,
}
const DEFAULT_PRICE_FIELD: FieldDescriptor<Product> = {
  name: 'default_price', label: 'Default price', type: 'text',
}

export function createProductsColumns(onDelete: (row: Product) => void): ColumnDef<Product>[] {
  return [
    renderColumn(ID_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(NAME_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(DEFAULT_PRICE_FIELD, { columnDef: { enableSorting: false } }),
    {
      id: 'actions',
      cell: ({ row }) => (
        <ResourceRowActions
          resourceKey='product'
          editTo='/products/saisie/$id'
          editParams={{ id: row.original.id }}
          onDelete={() => onDelete(row.original)}
        />
      ),
    },
  ]
}
```

`render` prend le dessus sur l'affichage par défaut (résolution de
`select` en libellé, formatage date/datetime via `getDisplayValue`) —
utiliser `render` pour un Badge coloré, un texte tronqué (`LongText`),
etc. `clickable`/`linkTo` enveloppe la valeur dans un lien (voir la
colonne "Customer" de `ventes-columns.tsx`, qui navigue vers la fiche
client). `columnDef` fusionne des options TanStack Table brutes
(`enableSorting`, `enableHiding`, `filterFn`).

`ResourceRowActions` (`src/components/crud/resource-row-actions.tsx`)
déduit les permissions `change_<resourceKey>`/`delete_<resourceKey>`
automatiquement. Pour des actions métier en plus (ex. `Valider`/
`Annuler` sur Vente, qui ont besoin de hooks propres), garder un fichier
`data-table-row-actions.tsx` dédié qui wrappe `ResourceRowActions` avec
`extraActions` plutôt que de généraliser ce cas précis (voir
`ventes/components/data-table-row-actions.tsx`).

### 2.7. `components/products-table.tsx` — la liste, filtrée/triée/paginée côté serveur

C'est le fichier qui **construit la requête backend** à partir de l'état
d'URL — tout le reste (rendu table/pagination/toolbar) est délégué à
`ResourceDataTable`, générique :

```tsx
export function ProductsTable({ search, navigate, onDelete }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = useMemo(() => createProductsColumns(onDelete), [onDelete])

  const { columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } =
    useTableUrlState({
      search, navigate,
      pagination: { defaultPage: 1, defaultPageSize: 10 },
      globalFilter: { enabled: false },
      columnFilters: [
        { columnId: 'name', searchKey: 'name', type: 'string' },
        { columnId: 'created_at', type: 'range', minSearchKey: 'created_from', maxSearchKey: 'created_to' },
      ],
    })

  // `columnFilters` reflète la saisie en cours (immédiat) ; `appliedFilters`
  // ne change qu'au clic sur "Search" — seul lui alimente la requête
  // backend, pour ne pas interroger le serveur à chaque frappe.
  const [appliedFilters, setAppliedFilters] = useState<ColumnFiltersState>(columnFilters)
  const name = getColumnFilterValue<string>(appliedFilters, 'name')
  const createdAt = getColumnFilterValue<{ min?: string; max?: string }>(appliedFilters, 'created_at')

  const { data, isLoading, isError } = useProductsPage({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ordering: buildOrdering(sorting),
    search: name || undefined,
    filters: { created_at_min: createdAt?.min, created_at_max: createdAt?.max },
  })

  const pageCount = data ? Math.max(1, Math.ceil(data.count / pagination.pageSize)) : 1
  useEffect(() => { ensurePageInRange(pageCount) }, [pageCount, ensurePageInRange])

  if (isLoading) return <Loader2 className='animate-spin' />
  if (isError) return <p className='text-destructive'>Failed to load products.</p>

  return (
    <ResourceDataTable
      data={data?.results ?? []}
      columns={columns}
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      columnFilters={columnFilters}
      onColumnFiltersChange={onColumnFiltersChange}
      sorting={sorting}
      onSortingChange={setSorting}
      toolbar={{
        searchKey: 'name', searchTitle: 'Name', searchPlaceholder: 'Filter by name...',
        rangeFilters: [{ columnId: 'created_at', title: 'Created', type: 'date' }],
        onSearch: () => setAppliedFilters(columnFilters),
      }}
    />
  )
}
```

Points clés de ce fichier :

- **`ResourceDataTable` est entièrement contrôlé** (`manualFiltering`/
  `manualSorting`/`manualPagination`) — `data` ne contient que la page
  courante, jamais tout le jeu de données. `pageCount` vient de `count`
  renvoyé par l'API, pas d'un calcul en mémoire.
- **Bouton "Search"** (`toolbar.onSearch`) — sans lui, chaque frappe dans
  un filtre texte/intervalle appellerait le backend immédiatement. En
  passant `onSearch`, les filtres (texte, popup, intervalle) n'appellent
  le backend qu'au clic. Omettre `onSearch` si la ressource n'a besoin
  d'aucun de ces filtres (aucun cas actuellement).
- **Filtres disponibles**, tous branchés sur `toolbar` :
  - `searchKey`/`searchTitle`/`searchPlaceholder` → `DataTableTextFilter`
    (texte libre en popup nommé, envoyé comme `search=` générique côté
    API — `search_fields` du ViewSet, voir guide backend § 5).
  - `filters: [{ columnId, title, options }]` → `DataTableFacetedFilter`
    (sélection multiple à cases à cocher, ex. Status/Role — envoyée
    jointe par virgule à un `CharInFilter` côté backend, voir guide
    backend § 4).
  - `rangeFilters: [{ columnId, title, type }]` → `DataTableRangeFilter`
    (intervalle min/max pour `number`/`date`/`datetime`) — associer la
    colonne correspondante à `columnDef: { filterFn: rangeFilterFn(type) }`
    dans `*-columns.tsx` (le `filterFn` lui-même n'est plus exécuté en
    mode manuel, mais documente/teste la logique de comparaison
    indépendamment — voir `src/lib/fields/range-filter-fn.ts`).
- **`getColumnFilterValue`/`buildOrdering`** (`src/lib/crud/column-filters.ts`)
  — lisent `columnFilters`/`sorting` pour construire les paramètres
  attendus par le backend (`search`, `ordering`, et les clés de `filters`
  spécifiques à la ressource).

Pourquoi garder ce fichier plutôt que tout mettre dans `index.tsx` : il
reste le point d'extension propre à cette ressource (ajouter un filtre,
changer le tri par défaut) sans risquer de casser le dialog de
suppression ou le bouton "Add" qui vivent dans `index.tsx`.

### 2.8. `components/products-primary-buttons.tsx`

```tsx
export function ProductsPrimaryButtons() {
  if (!hasPermission('add_product')) return null
  return (
    <Button asChild>
      <Link to='/products/saisie'>Add Product</Link>
    </Button>
  )
}
```

### 2.9. `index.tsx` — page "Liste"

Assemble le chrome (titre, bouton "Add") + `ProductsTable` + le dialog de
suppression générique. Ne fetch **pas** la liste lui-même — c'est
`ProductsTable` qui s'en charge (§ 2.7) :

```tsx
const route = getRouteApi('/_authenticated/products/')

export function Products() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const deleteProduct = useDeleteProduct()
  const { open, currentRow, requestDelete, onOpenChange } = useDeleteDialogState<Product>()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div><h2 className='text-2xl font-bold tracking-tight'>Products</h2></div>
          <ProductsPrimaryButtons />
        </div>
        <ProductsTable search={search} navigate={navigate} onDelete={requestDelete} />
      </Main>

      {currentRow && (
        <ResourceDeleteDialog
          open={open} onOpenChange={onOpenChange}
          resourceLabel='Product' itemLabel={currentRow.name}
          confirmValue={currentRow.sku} confirmFieldLabel='SKU'
          onDelete={() => deleteProduct.mutateAsync(currentRow.id)}
          isPending={deleteProduct.isPending}
        />
      )}
    </>
  )
}
```

`useDeleteDialogState<T>()` remplace l'ancien trio provider+dialogs+
delete-dialog par ressource : Add/Edit sont des pages (navigation), il ne
reste que Delete à gérer, donc un simple état local suffit. Le
`<Header>` (Search/ThemeSwitch/ProfileDropdown) n'a pas à être répété ici
— il est rendu une seule fois par `AuthenticatedLayout`.

### 2.10. `saisie.tsx` — page "Saisie" (create + edit)

```tsx
export function ProductsSaisie({ productId }: ProductsSaisieProps) {
  const navigate = useNavigate()
  const isEdit = !!productId
  const { data, isLoading } = useProducts()   // fetchAll, pas fetchList
  const currentRow = isEdit ? data?.find((p) => p.id === productId) : undefined

  function goToList() { navigate({ to: '/products' }) }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      {isEdit && isLoading ? <Loader2 className='animate-spin' />
        : isEdit && !currentRow ? <p>Product not found.</p>
        : <ProductsForm currentRow={currentRow} onSuccess={goToList} onCancel={goToList} />}
    </Main>
  )
}
```

**Pourquoi `useProducts()` (liste complète) plutôt qu'un endpoint
`/products/{id}/` dédié** : la liste complète est déjà chargée et cachée
par TanStack Query, donc pas besoin d'aller-retour réseau supplémentaire.
Si une ressource devient trop volumineuse pour être chargée en entier,
revoir cette approche (fetch dédié par id).

L'édition réutilise le **même** `ProductsForm`/`ProductsSaisie` que la
création — seule la prop `currentRow` change le comportement (`isEdit`).

---

## 3. Créer les routes (TanStack Router)

Routing par fichiers (`@tanstack/router-plugin/vite`) : chaque fichier
sous `src/routes/` génère une route, `src/routeTree.gen.ts` est
**auto-généré** — ne jamais l'éditer à la main.

```
products/
├── index.tsx          # "/products"            -> Liste
└── saisie/
    ├── index.tsx       # "/products/saisie"      -> Saisie (create)
    └── $id.tsx         # "/products/saisie/$id"  -> Saisie (edit)
```

```tsx
// products/index.tsx
export const Route = createFileRoute('/_authenticated/products/')({
  validateSearch: productsSearchSchema,   // z.object({ page, pageSize, name, ... })
  component: Products,
})

// products/saisie/$id.tsx
export const Route = createFileRoute('/_authenticated/products/saisie/$id')({
  component: RouteComponent,
})
function RouteComponent() {
  const { id } = Route.useParams()
  return <ProductsSaisie productId={id} />
}
```

**Piège à éviter absolument** : ne PAS créer `saisie.tsx` et
`saisie.$id.tsx` comme deux fichiers **plats** au même niveau. TanStack
Router interprète la notation par points comme du **nesting parent/
enfant** : `saisie.$id.tsx` deviendrait un enfant de `saisie.tsx`, qui ne
rend pas d'`<Outlet/>` — la page d'édition afficherait silencieusement le
contenu de la page de création (aucune erreur au build). Utiliser un vrai
dossier `saisie/` avec `index.tsx` + `$id.tsx` évite ce nesting implicite.

Après avoir ajouté des fichiers de route, lancer `pnpm dev` au moins une
fois pour que `routeTree.gen.ts` se régénère avant `pnpm build`.

---

## 4. Liaison vers le backend

- **`src/lib/api-client.ts`** — instance axios unique, intercepteur qui
  ajoute `Authorization: Bearer <access>` et rafraîchit automatiquement le
  token sur un 401. Toujours passer par `apiClient`, jamais par un
  `fetch`/`axios` brut.
- **`src/lib/pagination.ts`** — type `PaginatedResponse<T>`
  (`count`/`next`/`previous`/`results`, format DRF).
- **`ListParams`** (`src/lib/crud/create-resource-api.ts`) —
  `{ page, pageSize, ordering?, search?, filters? }`, mappé par
  `fetchList` sur les query params réels envoyés à Django (`page`,
  `page_size`, `ordering`, `search`, et les clés de `filters` telles
  quelles — voir guide backend pour les noms attendus par chaque
  ressource : `created_at_min`/`max`, `status`, `roles`...).
- **`src/stores/auth-store.ts`** (Zustand) — `auth.user` (avec `roles` et
  `permissions`, remontés par `GET /api/auth/me/` au login), et les
  helpers `hasRole('admin')`/`hasPermission('add_product')`. Le nom de
  permission côté frontend est **toujours** `<action>_<modèle>` en
  minuscules — exactement le `codename` Django (voir guide backend § 5).
- **Garde de route** — `src/routes/_authenticated/route.tsx` redirige
  vers `/sign-in` si pas de token. Pour une page réservée à un rôle
  précis (comme Roles/Users), reproduire le `beforeLoad` avec `hasRole`
  dans le fichier de route lui-même (voir
  `routes/_authenticated/roles/index.tsx`).

---

## 5. Cas particuliers déjà rencontrés

- **Ressource avec lignes imbriquées** (Ventes/VenteLigne) — `toPayload`
  dans `api.ts` reformate les lignes ; `fillsFields` sur le champ produit
  remplit `unit_price` (§ 2.4) ; `useFieldArray` (react-hook-form) gère
  l'ajout/suppression de lignes. Voir `ventes/components/ventes-form.tsx`.
- **Ressource sans create/update/delete API** (Users, créé via
  `/auth/register`) — n'utilise que `fetchAllPages`/un `fetchList` écrit
  à la main, pas `createResourceApi`. Voir `users/api.ts`.
- **Formulaire en dialog plutôt qu'en page Saisie** (aucun cas actuel —
  Roles est passé de dialog à page Saisie dédiée en cours de projet, plus
  cohérent avec le reste) — si un jour un formulaire doit rester un
  dialog modal (ex. très court, pas besoin d'URL dédiée), `RenderFormField`
  fonctionne identiquement à l'intérieur d'un `<Dialog>`.
- **Gating par rôle plutôt que par permission** (Roles/Users) — voir
  `crudMenuItem(..., gateByRole: 'admin')` en § 1.

---

Une fois la ressource créée côté backend (voir l'autre guide) et
suivie ici, elle est utilisable immédiatement dans l'app.
