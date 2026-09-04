# POC Vente Frontend

Frontend du POC Ventes — interface d'administration pour le backend
[`poc-vente-back`](https://github.com/Fandresena040204/poc-vente-back)
(Django/DRF). Basé sur le template [shadcn-admin](https://github.com/Fandresena040204/Admin-template)
(React 19 + Vite + TanStack Router/Query/Table + shadcn/ui), copié dans ce
dépôt séparé pour ne pas modifier le template d'origine.

Voir `TODO.md` pour l'état d'avancement détaillé.

## Stack

- [React](https://react.dev/) 19 + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Router](https://tanstack.com/router/latest) (routing par fichiers)
- [TanStack Query](https://tanstack.com/query/latest) (état serveur)
- [TanStack Table](https://tanstack.com/table/latest) (tableaux de données)
- [shadcn/ui](https://ui.shadcn.com) (TailwindCSS + RadixUI)
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) (formulaires/validation)
- [axios](https://axios-http.com/) (client HTTP)
- [Zustand](https://zustand-demo.pmnd.rs/) (état client : auth)

## Prérequis

- Node.js 20+
- pnpm
- Le backend `poc-vente-back` doit tourner en local (`python manage.py runserver`,
  port 8000 par défaut) pour que l'app fonctionne — voir son README pour le
  setup.

## Installation

```bash
pnpm install
```

## Configuration

```bash
cp .env.example .env
```

`VITE_API_BASE_URL` doit pointer vers l'API Django (`http://localhost:8000`
en local).

## Développement

```bash
pnpm dev
```

L'app tourne sur `http://localhost:5173` — déjà autorisé en CORS côté
backend par défaut.

## Build

```bash
pnpm build
```

## Tests / Lint

```bash
pnpm test
pnpm lint
```

## License

[MIT](LICENSE)
