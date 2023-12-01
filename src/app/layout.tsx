import type { Metadata } from 'next'
import './globals.css'
import { Vazirmatn } from 'next/font/google'
const vazirmatn = Vazirmatn({ subsets: ['latin'], })
export const metadata: Metadata = {
  title: 'MirimaEstate',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${vazirmatn.className} min-h-screen h-screen bg-gray-200`}>{children}</body>
    </html>
  )
}
