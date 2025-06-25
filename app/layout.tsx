import type { Metadata } from 'next'
import './globals.css'
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: '갈래말래',
  description: '갈래말래와 함께 여행지 추천부터 일정까지!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
          {children}
      </body>
    </html>
  )
}
