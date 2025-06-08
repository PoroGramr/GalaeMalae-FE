"use client"

import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"

interface LandingPageProps {
  onStartSurvey: () => void
}

export function LandingPage({ onStartSurvey }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white px-4 py-12 text-center">
      <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl md:text-8xl">
        <span className="block text-sky-600">갈래 말래</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl md:text-2xl">
        당신의 취향에 딱 맞는 여행지를 찾아드리고, 완벽한 일정을 제안해 드립니다.
        <br />몇 가지 질문에 답하고 꿈꾸던 여행을 시작하세요!
      </p>
      <div className="mt-10">
        <Button onClick={onStartSurvey} size="lg" className="px-8 py-4 text-lg">
          <Plane className="mr-3 h-6 w-6" />
          나만의 여행 계획 시작하기
        </Button>
      </div>
    </div>
  )
}
