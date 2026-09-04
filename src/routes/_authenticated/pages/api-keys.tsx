import { createFileRoute } from '@tanstack/react-router'
import { ApiKeysPage } from '@/features/pages/api-keys'

export const Route = createFileRoute('/_authenticated/pages/api-keys')({
  component: ApiKeysPage,
})
