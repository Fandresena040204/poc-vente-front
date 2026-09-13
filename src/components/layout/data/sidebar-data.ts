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
import { crudMenuItem } from './crud-menu-item'
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
        crudMenuItem('Ventes', Receipt, 'vente', '/ventes'),
        crudMenuItem('Products', Package, 'product', '/products'),
        crudMenuItem('Customers', Users, 'customer', '/customers'),
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
        crudMenuItem('Roles', ShieldCheck, 'role', '/roles', 'admin'),
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
