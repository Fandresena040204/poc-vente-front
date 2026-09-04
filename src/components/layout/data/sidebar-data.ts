import {
  ChartSpline,
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Table,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutGrid,
  Calendar,
  Kanban,
  Mail,
  Contact,
  Ticket,
  Receipt,
  CircleUser,
  Newspaper,
  ShoppingCart,
  CreditCard,
  Rocket,
  KeyRound,
  Plug,
  Rows3,
  Smile,
  Store,
  Info,
  ListOrdered,
  PackagePlus,
  SquarePen,
  Blocks,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Fandresena',
    email: 'fandresenamickael04@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboards',
          icon: LayoutDashboard,
          items: [
            { title: 'Default', url: '/' },
            { title: 'eCommerce', url: '/dashboards/ecommerce' },
            { title: 'Music', url: '/dashboards/music' },
            { title: 'General', url: '/dashboards/general' },
          ],
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Apps',
          icon: Package,
          items: [
            { title: 'App Store', url: '/apps' },
            { title: 'Calendar', url: '/calendar', icon: Calendar },
            { title: 'Kanban', url: '/kanban', icon: Kanban },
            { title: 'Email', url: '/mail', icon: Mail },
            { title: 'Contacts', url: '/contacts', icon: Contact },
            { title: 'Tickets', url: '/tickets', icon: Ticket },
            { title: 'Invoices', url: '/invoices', icon: Receipt },
            { title: 'Profile', url: '/profile', icon: CircleUser },
            { title: 'Blog', url: '/blog', icon: Newspaper },
            { title: 'Customers', url: '/customers', icon: Users },
            { title: 'Orders', url: '/orders', icon: Package },
          ],
        },
        {
          title: 'Ecommerce',
          icon: ShoppingCart,
          items: [
            { title: 'Shop', url: '/ecommerce/shop', icon: Store },
            { title: 'Details', url: '/ecommerce/details', icon: Info },
            { title: 'List', url: '/ecommerce/list', icon: ListOrdered },
            { title: 'Checkout', url: '/ecommerce/checkout', icon: CreditCard },
            {
              title: 'Add Product',
              url: '/ecommerce/add-product',
              icon: PackagePlus,
            },
            {
              title: 'Edit Product',
              url: '/ecommerce/edit-product',
              icon: SquarePen,
            },
          ],
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Charts',
          icon: ChartSpline,
          items: [
            { title: 'Area', url: '/charts/area' },
            { title: 'Bar', url: '/charts/bar' },
            { title: 'Line', url: '/charts/line' },
            { title: 'Pie', url: '/charts/pie' },
            { title: 'Radar', url: '/charts/radar' },
            { title: 'Radial', url: '/charts/radial' },
          ],
        },
        {
          title: 'Tables',
          icon: Table,
          items: [
            { title: 'Basic Tables', url: '/tables/basic' },
            { title: 'Data Tables', url: '/tables/data' },
            { title: 'Advanced Filters', url: '/tables/filters' },
          ],
        },
        {
          title: 'UI Elements',
          url: '/ui-elements',
          icon: Blocks,
        },
        {
          title: 'Widgets',
          icon: LayoutGrid,
          items: [
            { title: 'Cards', url: '/widgets/cards' },
            { title: 'Banners', url: '/widgets/banners' },
          ],
        },
        {
          title: 'Pages',
          icon: Rows3,
          items: [
            { title: 'Pricing', url: '/pages/pricing', icon: CreditCard },
            { title: 'Landing Page', url: '/pages/landing', icon: Rocket },
            { title: 'Role Based Access', url: '/pages/roles', icon: ShieldCheck },
            { title: 'Integrations', url: '/pages/integrations', icon: Plug },
            { title: 'API Keys', url: '/pages/api-keys', icon: KeyRound },
          ],
        },
        {
          title: 'Icons',
          url: '/icons',
          icon: Smile,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
