export type Email = {
  id: string
  from: string
  initials: string
  subject: string
  preview: string
  body: string
  date: string
  unread: boolean
  folder: 'inbox' | 'sent' | 'drafts' | 'starred'
}

export const emails: Email[] = [
  {
    id: '1',
    from: 'Sarah Lee',
    initials: 'SL',
    subject: 'Q3 revenue report is ready',
    preview: 'Hi team, the Q3 revenue report is attached along with...',
    body: 'Hi team,\n\nThe Q3 revenue report is attached along with a breakdown by region. Overall growth is up 12% quarter over quarter, driven mostly by the Pro plan upgrades.\n\nLet me know if you have questions before the board meeting.\n\nBest,\nSarah',
    date: '09:24',
    unread: true,
    folder: 'inbox',
  },
  {
    id: '2',
    from: 'Mathew Anderson',
    initials: 'MA',
    subject: 'Design review feedback',
    preview: 'Left a few comments on the new invoice template...',
    body: 'Left a few comments on the new invoice template Figma file. Mostly small spacing tweaks, nothing blocking. Should be ready to hand off to engineering by Friday.',
    date: 'Yesterday',
    unread: true,
    folder: 'inbox',
  },
  {
    id: '3',
    from: 'GitHub',
    initials: 'GH',
    subject: '[Admin-template] New pull request #128',
    preview: 'Fandresena opened a pull request: Add Widgets menu...',
    body: 'Fandresena opened a pull request:\n\n"Add Widgets menu"\n\n2 files changed, 340 additions, 0 deletions.',
    date: 'Yesterday',
    unread: false,
    folder: 'inbox',
  },
  {
    id: '4',
    from: 'Stripe',
    initials: 'ST',
    subject: 'Your August invoice is available',
    preview: 'Your invoice for August 1 - August 31 is ready to view.',
    body: 'Your invoice for August 1 - August 31 is ready to view. Total amount due: $29.00. It will be charged automatically to your card on file.',
    date: 'Aug 10',
    unread: false,
    folder: 'inbox',
  },
  {
    id: '5',
    from: 'Jonathan Doe',
    initials: 'JD',
    subject: 'Re: Kickoff call notes',
    preview: 'Thanks for sending these over, looks good to me...',
    body: "Thanks for sending these over, looks good to me. One small addition — let's make sure we cover the API rate limits during the technical deep dive.",
    date: 'Aug 9',
    unread: false,
    folder: 'inbox',
  },
  {
    id: '6',
    from: 'You',
    initials: 'FM',
    subject: 'Weekly status update',
    preview: 'Sent to the product team',
    body: 'Hi team,\n\nHere is a quick summary of what shipped this week: advanced filters, the widgets gallery, and the new pricing page.\n\nFandresena',
    date: 'Aug 8',
    unread: false,
    folder: 'sent',
  },
  {
    id: '7',
    from: 'You',
    initials: 'FM',
    subject: 'Draft: Partnership proposal',
    preview: '(no subject content yet)',
    body: 'Draft in progress...',
    date: 'Aug 7',
    unread: false,
    folder: 'drafts',
  },
]
