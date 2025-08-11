import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'XNote - WYSIWYG Markdown Editor',
  description:
    'A powerful, real-time collaborative Markdown editor with cloud sync',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
