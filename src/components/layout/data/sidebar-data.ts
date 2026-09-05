import {
  LayoutDashboard,
  Receipt,
  Package,
  Users,
  ShieldCheck,
  Bug,
  Lock,
  FileX,
  UserX,
  ServerOff,
  Settings,
  UserCog,
  HelpCircle,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'POC Ventes',
      logo: Command,
      plan: 'Admin',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Ventes',
          icon: Receipt,
          items: [
            { title: 'Liste', url: '/ventes', permission: 'view_vente' },
            { title: 'Saisie', url: '/ventes/saisie', permission: 'add_vente' },
          ],
        },
        {
          title: 'Products',
          icon: Package,
          items: [
            { title: 'Liste', url: '/products', permission: 'view_product' },
            {
              title: 'Saisie',
              url: '/products/saisie',
              permission: 'add_product',
            },
          ],
        },
        {
          title: 'Customers',
          icon: Users,
          items: [
            { title: 'Liste', url: '/customers', permission: 'view_customer' },
            {
              title: 'Saisie',
              url: '/customers/saisie',
              permission: 'add_customer',
            },
          ],
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: UserCog,
          role: 'admin',
        },
        {
          title: 'Roles',
          url: '/roles',
          icon: ShieldCheck,
          role: 'admin',
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            { title: 'Unauthorized', url: '/errors/unauthorized', icon: Lock },
            { title: 'Forbidden', url: '/errors/forbidden', icon: UserX },
            { title: 'Not Found', url: '/errors/not-found', icon: FileX },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
          ],
        },
      ],
    },
  ],
}
