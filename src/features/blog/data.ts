export type BlogPost = {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  initials: string
  date: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building multi-criteria filters like ERPNext',
    excerpt:
      'A look at how we designed a stacked filter builder with AND-combined conditions for our data tables.',
    category: 'Engineering',
    author: 'Fandresena',
    initials: 'FM',
    date: 'Aug 12, 2026',
    readTime: '6 min read',
  },
  {
    id: '2',
    title: 'Why we moved to TanStack Router',
    excerpt:
      'File-based routing, type-safe links, and how it changed the way we structure features.',
    category: 'Engineering',
    author: 'Sarah Lee',
    initials: 'SL',
    date: 'Aug 5, 2026',
    readTime: '5 min read',
  },
  {
    id: '3',
    title: 'Designing dashboards people actually use',
    excerpt:
      'Lessons learned from cutting our stat card count in half and what replaced them.',
    category: 'Design',
    author: 'Mathew Anderson',
    initials: 'MA',
    date: 'Jul 28, 2026',
    readTime: '4 min read',
  },
  {
    id: '4',
    title: 'A practical guide to role based access control',
    excerpt:
      'How permission matrices work, and how to avoid painting yourself into a corner.',
    category: 'Product',
    author: 'Jonathan Doe',
    initials: 'JD',
    date: 'Jul 20, 2026',
    readTime: '7 min read',
  },
  {
    id: '5',
    title: 'Shipping dark mode without breaking charts',
    excerpt:
      'Recharts, CSS variables, and the small details that make dark mode feel native.',
    category: 'Engineering',
    author: 'Sarah Lee',
    initials: 'SL',
    date: 'Jul 14, 2026',
    readTime: '5 min read',
  },
  {
    id: '6',
    title: 'From spreadsheet to dashboard: a migration story',
    excerpt:
      'How one customer moved their entire ops process off spreadsheets in three weeks.',
    category: 'Customer story',
    author: 'Fandresena',
    initials: 'FM',
    date: 'Jul 2, 2026',
    readTime: '8 min read',
  },
]
