import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hive - AI-Powered Portfolio Intelligence',
  description: 'Visualize the future of your investments with AI-powered predictions and confidence analytics.',
  keywords: ['portfolio', 'AI', 'trading', 'stocks', 'crypto', 'predictions'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
