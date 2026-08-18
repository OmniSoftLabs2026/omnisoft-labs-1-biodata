import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'BiodataCraft — Elegant Marriage Biodata Generator',
  description: 'Create a beautiful, premium marriage biodata in minutes. Simple, private, and elegant.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
