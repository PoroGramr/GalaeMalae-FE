"use client"

import { Button } from "@/components/ui/button"
import { Plane, MapPin, CalendarCheck, HeartHandshake } from "lucide-react"
import { useEffect, useState } from "react"

interface LandingPageProps {
  onStartSurvey: () => void
}

export function LandingPage({ onStartSurvey }: LandingPageProps) {
  const [userCount, setUserCount] = useState<number | null>(null)
  const [planCount, setPlanCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.galaemalae.com/api/v1/survey/submit/count', {
      headers: { 'accept': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') setUserCount(data.count)
      })
      .catch(() => setUserCount(null))

    fetch('https://api.galaemalae.com/api/v1/plan/create/count', {
      headers: { 'accept': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') setPlanCount(data.count)
      })
      .catch(() => setPlanCount(null))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white px-4 py-12 text-center">
      {/* Hero Section */}
      <div className="w-full max-w-4xl mx-auto mb-12 pt-12 pb-8">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl md:text-8xl">
          <span className="block text-sky-600">갈래 말래</span>
        </h1>
        {/* max-w-2xl -> max-w-4xl로 변경하여 텍스트 너비 확장 */}
        <p className="mt-4 max-w-4xl mx-auto text-lg text-gray-600 sm:text-xl md:text-2xl">
          당신의 취향에 딱 맞는 여행지를 찾아드리고, 완벽한 일정을 제안해 드립니다.
        </p>
      </div>

      {/* Statistics Section */}
      <div className="mt-8 mb-12 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-sky-600 mb-2">
              {userCount !== null ? userCount.toLocaleString() + '명' : '...'}
            </div>
            <div className="text-sm text-gray-600">지금까지 추천받은 여행자</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-sky-600 mb-2">
              {planCount !== null ? planCount.toLocaleString() + '개' : '...'}
            </div>
            <div className="text-sm text-gray-600">지금까지 생성된 여행코스</div>
          </div>
        </div>
      </div>

      {/* Service Description */}
      <p className="mt-6 max-w-3xl text-xl text-gray-700 sm:text-2xl md:text-3xl leading-relaxed">
        복잡한 여행 계획은 이제 그만!<br /> <span className="font-semibold text-sky-600">갈래 말래</span>는 몇 가지 간단한
        질문을 통해<br/> 당신의 여행 스타일을 파악하고, <br />꿈꾸던 여행을 현실로 만들어 드립니다.
      </p>

      {/* Feature Highlights */}
      <div className="mt-16 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">왜 갈래 말래와 함께해야 할까요?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
            <MapPin className="h-12 w-12 text-sky-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">맞춤형 여행지 추천</h3>
            <p className="text-gray-600 text-center">
              당신의 선호도에 맞춰 전 세계 수많은 여행지 중 최적의 장소를 찾아드립니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
            <CalendarCheck className="h-12 w-12 text-sky-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">간편한 일정 계획</h3>
            <p className="text-gray-600 text-center">
              복잡한 일정 짜기는 이제 그만! 추천 여행지에 대한 상세 일정을 자동으로 생성해 드립니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
            <HeartHandshake className="h-12 w-12 text-sky-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">당신만을 위한 테마</h3>
            <p className="text-gray-600 text-center">
              휴양, 모험, 식도락 등 당신이 원하는 여행 테마에 맞춰 모든 것을 준비합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="mt-16">
        <Button onClick={onStartSurvey} size="lg" className="px-10 py-5 text-xl">
          <Plane className="mr-3 h-7 w-7" />
          나만의 여행 계획 시작하기
        </Button>
      </div>
    </div>
  )
}
