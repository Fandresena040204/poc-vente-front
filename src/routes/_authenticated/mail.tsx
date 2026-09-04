import { createFileRoute } from '@tanstack/react-router'
import { MailPage } from '@/features/mail'

export const Route = createFileRoute('/_authenticated/mail')({
  component: MailPage,
})
