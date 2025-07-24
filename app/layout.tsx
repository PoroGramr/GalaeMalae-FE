import type { Metadata } from 'next'
import './globals.css'
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: '여행 일정 추천 - 갈래말래',
  description: '여행 일정 추천, 맞춤 여행지, AI 일정 생성까지! 갈래말래에서 쉽고 빠르게 여행 계획을 세워보세요.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="JMi4-LmY1QSOgbfnHhSwkr8FgnZB8F5lGuygeX7LlI4" />
        <meta name="naver-site-verification" content="c515040db9920af8dbf200ac96478bf69ab15fe8" />
        <meta property="og:title" content="여행 일정 추천 - 갈래말래" />
        <meta property="og:description" content="여행 일정 추천, 맞춤 여행지, AI 일정 생성까지! 갈래말래에서 쉽고 빠르게 여행 계획을 세워보세요." />
      </head>
      <body>
          {children}
      </body>
    </html>
  )
}
