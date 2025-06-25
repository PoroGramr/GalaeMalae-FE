"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Hotel, Compass, Plane } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleLoginBtn } from "@/components/GoogleLoginBtn"
import AuthDialog from "@/components/AuthDialog"

interface Activity {
  time: string
  title: string
  description: string
}

interface DayItinerary {
  day: number
  activities: Activity[]
}

interface Destination {
  id: number
  name: string
  description: string
  image: string
  climate: string
  bestFor: string[] // API와 일치하도록 유지
  budget: string
}

interface TravelResultsProps {
  recommendedDestinations: Destination[]
  itineraries: { [key: number]: DayItinerary[] } // 각 여행지 ID에 매핑되는 일정
  summary: {
    q1: string
    q2: string
    q3: string
    q4: string
    q5: string
    q6: string
    q7: string
  }
  onReset: () => void
}

export function TravelResultsDisplay({ recommendedDestinations, itineraries, summary, onReset }: TravelResultsProps) {
  // recommendedDestinations가 비어있을 경우를 대비하여 초기값 설정
  const [selectedDestinationId, setSelectedDestinationId] = useState<number>(recommendedDestinations[0]?.id || 0)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  // currentDestination이 undefined가 되지 않도록 안전한 폴백 추가
  const currentDestination = recommendedDestinations.find((d) => d.id === selectedDestinationId) ||
    recommendedDestinations[0] || {
      // recommendedDestinations가 비어있을 경우 사용될 기본 객체
      id: 0,
      name: "추천 여행지 없음",
      description: "조건에 맞는 여행지를 찾을 수 없습니다.",
      image: "/placeholder.svg?height=400&width=600",
      climate: "정보 없음",
      bestFor: [], // 이 부분이 중요! 항상 배열이어야 map 호출 시 오류가 발생하지 않음
      budget: "정보 없음",
    }
  const currentItinerary = itineraries[selectedDestinationId] || []
  const [showItinerary, setShowItinerary] = useState(false)
  const [nights, setNights] = useState(2)
  const [days, setDays] = useState(3)
  const [customPlan, setCustomPlan] = useState<any[] | null>(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [planError, setPlanError] = useState<string | null>(null)

  const questionLabels: { [key: string]: string } = {
    q1: "여행 즐거움",
    q2: "경관 선호",
    q3: "여행 동행자",
    q4: "선호 기후",
    q5: "식도락",
    q6: "이동 수단",
    q7: "여행 페이스",
  }

  const answerLabels: { [key: string]: string } = {
    sightseeing: "관광 명소 탐방",
    relaxation: "휴양 및 휴식",
    beach: "해변",
    mountain_forest: "산/숲",
    solo: "혼자",
    friends_colleagues: "친구/동료",
    family: "가족",
    couple: "연인",
    warm: "따뜻함",
    pleasant: "쾌적함",
    cool: "선선함",
    cold: "추위",
    traditional_food: "전통 음식",
    fusion_cuisine: "퓨전 맛집",
    street_food: "길거리 음식",
    vegetarian_vegan: "채식/비건",
    car_rental: "자가용 렌트",
    public_transport: "대중교통",
    walk_bike: "도보/자전거",
    tour_bus: "투어 버스",
    relaxed: "여유롭게",
    normal: "보통",
    intensive: "빡빡하게",
    spontaneous: "즉흥적으로",
  }

  return (
    <>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <Button
            onClick={onReset}
            variant="ghost"
            className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-4"
          >
            <Plane className="mr-2 h-4 w-4" />
            <span>새로운 여행 계획하기</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">맞춤형 여행 추천 결과</h1>
          <p className="mt-2 text-lg text-gray-600">입력하신 정보를 바탕으로 최적의 여행지와 일정을 추천해드립니다.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">입력 정보 요약</h2>
              <div className="space-y-3">
                {Object.entries(summary).map(([key, value]) => (
                  <div key={key} className="flex items-start">
                    <Compass className="h-5 w-5 text-sky-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{questionLabels[key] || key}</p>
                      <p className="text-sm text-gray-600">{answerLabels[value] || value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="w-full">
              <div className="grid gap-6 md:grid-cols-3">
                {recommendedDestinations.map((destination) => (
                  <Card
                    key={destination.id}
                    className={`overflow-hidden cursor-pointer transition-all ${selectedDestinationId === destination.id ? "ring-2 ring-sky-500" : ""}`}
                    onClick={() => {
                      setSelectedDestinationId(destination.id)
                      setShowItinerary(false)
                    }}
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-sky-500" />
                        {destination.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{destination.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* 여행지 선택 시 일정 추천 버튼 표시 */}
              {selectedDestinationId && !showItinerary && (
                <div className="flex justify-center mt-8 items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="nights" className="text-sm">박수</label>
                    <select
                      id="nights"
                      className="border rounded px-2 py-1"
                      value={nights}
                      onChange={e => {
                        const n = Number(e.target.value)
                        setNights(n)
                        setDays(n + 1)
                      }}
                    >
                      {[1,2,3,4,5,6,7].map(n => (
                        <option key={n} value={n}>{n}박</option>
                      ))}
                    </select>
                    <label htmlFor="days" className="text-sm ml-2">일수</label>
                    <select
                      id="days"
                      className="border rounded px-2 py-1"
                      value={days}
                      onChange={e => {
                        const d = Number(e.target.value)
                        setDays(d)
                        setNights(Math.max(1, d - 1))
                      }}
                    >
                      {[2,3,4,5,6,7,8].map(d => (
                        <option key={d} value={d}>{d}일</option>
                      ))}
                    </select>
                  </div>
                  <Button size="lg" onClick={async () => {
                    setShowItinerary(true)
                    setPlanLoading(true)
                    setPlanError(null)
                    setCustomPlan(null)
                    try {
                      const response = await fetch("https://api.galaemalae.com/api/v1/plan/plan", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "accept": "application/json",
                        },
                        body: JSON.stringify({
                          destination: currentDestination.name,
                          schedule: `${nights}박${days}일`,
                        }),
                      })
                      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                      const data = await response.json()
                      setCustomPlan(data.plan)
                    } catch (err: any) {
                      setPlanError("일정 추천에 실패했습니다. 다시 시도해 주세요.")
                    } finally {
                      setPlanLoading(false)
                    }
                  }}>
                    {currentDestination.name} 일정 추천 보기
                  </Button>
                </div>
              )}
              {/* 일정 추천 영역 */}
              {showItinerary && (
                <div className="mt-10">
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        <MapPin className="inline-block h-5 w-5 mr-1 text-sky-500" />
                        {currentDestination.name} 추천 일정
                        <span className="ml-3 text-base font-normal text-gray-500">({nights}박 {days}일)</span>
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Hotel className="h-5 w-5 text-sky-500" />
                        <span className="text-sm font-medium">숙소: 4성급 호텔</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {answerLabels[summary.q7] || summary.q7} 페이스의 여행 일정입니다.
                    </p>
                  </div>
                  {/* 일정 추천 API 로딩/에러/결과 처리 */}
                  {planLoading && <p className="text-center text-gray-500">AI가 일정을 생성중입니다...</p>}
                  {planError && <p className="text-center text-red-500">{planError}</p>}
                  {customPlan && (
                    <div className="space-y-6">
                      {customPlan.map((day, idx) => (
                        <Card key={day.day || idx}>
                          <CardHeader>
                            <CardTitle>
                              {day.day ? `${day.day}일차: ` : ''}{day.description || `Day ${day.day}`}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ol className="relative border-l border-gray-200">
                              {day.places && day.places.map((place: any, index: number) => (
                                <li key={index} className="mb-6 ml-4 last:mb-0">
                                  <div className="absolute w-3 h-3 bg-sky-500 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                  <h3 className="text-base font-semibold text-gray-900">{place.name}</h3>
                                  <p className="text-sm text-gray-600">{place.address}</p>
                                  <p className="text-sm font-normal text-gray-600">{place.activity}</p>
                                  <p className="text-xs text-gray-400">예상비용: {place.estimated_cost}</p>
                                </li>
                              ))}
                            </ol>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  {/* 기존 일정 데이터는 customPlan이 없을 때만 표시 */}
                  {!planLoading && !planError && !customPlan && (
                    <div className="space-y-6">
                      {currentItinerary.length > 0 ? (
                        currentItinerary.map((day) => (
                          <Card key={day.day}>
                            <CardHeader>
                              <CardTitle>Day {day.day}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ol className="relative border-l border-gray-200">
                                {day.activities.map((activity, index) => (
                                  <li key={index} className="mb-6 ml-4 last:mb-0">
                                    <div className="absolute w-3 h-3 bg-sky-500 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                    <time className="mb-1 text-sm font-normal leading-none text-gray-500">
                                      {activity.time}
                                    </time>
                                    <h3 className="text-base font-semibold text-gray-900">{activity.title}</h3>
                                    <p className="text-sm font-normal text-gray-600">{activity.description}</p>
                                  </li>
                                ))}
                              </ol>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">이 여행지에 대한 일정이 없습니다.</p>
                      )}
                    </div>
                  )}
                  <div className="mt-8 flex justify-center">
                    <Button className="mr-4" onClick={() => setAuthDialogOpen(true)}>일정 저장하기</Button>
                    <Button variant="outline" onClick={() => setAuthDialogOpen(true)}>일정 공유하기</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
