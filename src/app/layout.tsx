"use client"
import { Inter } from 'next/font/google'
import './globals.scss'
import ChristmasSpirit from '@/lib/christmasSpirit';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    ChristmasSpirit();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='christmas-spirit'>
          {children}
        </div>
      </body>
    </html>
  )
}
