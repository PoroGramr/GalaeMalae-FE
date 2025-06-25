"use client"

import { useState } from "react"
import { QuestionPage } from "@/components/question-page"
import { TravelResultsDisplay } from "@/components/travel-results-display"
import { Skeleton } from "@/components/ui/skeleton"
import { questions } from "@/lib/questions"
import { LandingPage } from "@/components/landing-page" // LandingPage 임포트

// value -> ABCD 변환 매핑 테이블 추가
const answerMap: { [key: string]: { [key: string]: string } } = {
  q1: { sightseeing: "A", relaxation: "B" },
  q2: { beach: "A", mountain_forest: "B" },
  q3: { solo: "A", friends_colleagues: "B", family: "C", couple: "D" },
  q4: { warm: "A", pleasant: "B", cool: "C", cold: "D" },
  q5: { traditional_food: "A", fusion_cuisine: "B", street_food: "C", vegetarian_vegan: "D" },
  q6: { car_rental: "A", public_transport: "B", walk_bike: "C", tour_bus: "D" },
  q7: { relaxed: "A", normal: "B", intensive: "C", spontaneous: "D" },
}

function convertAnswers(answers: { [key: string]: string }) {
  const mapped: { [key: string]: string } = {}
  for (const q in answers) {
    mapped[q] = answerMap[q]?.[answers[q]] || ""
  }
  return mapped
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [recommendationData, setRecommendationData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLandingPage, setShowLandingPage] = useState(true) // 랜딩 페이지 표시 여부 상태 추가

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // 마지막 질문, 서버에 요청 보내기
      setIsLoading(true)
      setRecommendationData(null) // 이전 결과 초기화

      try {
        // 외부 API로 요청
        const response = await fetch("https://api.galaemalae.com/api/v1/survey/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: JSON.stringify(convertAnswers(answers)),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        // 외부 API 응답(recommendations)을 기존 컴포넌트에 맞게 매핑
        const recommendedDestinations = (data.recommendations || []).map((item: any, idx: number) => ({
          id: idx + 1, // 임시 id (API에 id 없음)
          name: item.name,
          description: item.description,
          country: item.country,
          latitude: item.latitude,
          longitude: item.longitude,
          image: "/placeholder.svg", // 이미지 없음 처리
          climate: "정보 없음", // 기후 정보 없음 처리
          bestFor: [], // bestFor 없음 처리
          budget: "정보 없음", // 예산 정보 없음 처리
        }))
        setRecommendationData({
          recommendedDestinations,
          itineraries: {}, // 외부 API에는 일정 없음
          summary: answers,
        })
        setCurrentStep(questions.length) // 결과 페이지로 이동
      } catch (error) {
        console.error("Error submitting form:", error)
        alert("여행 추천 중 오류가 발생했습니다. 다시 시도해주세요.")
        setIsLoading(false) // 에러 발생 시 로딩 상태 해제
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
    setRecommendationData(null)
    setIsLoading(false)
    setShowLandingPage(true) // 랜딩 페이지로 돌아가기
  }

  const handleStartSurvey = () => {
    setShowLandingPage(false) // 랜딩 페이지 숨기고 설문조사 시작
    setCurrentStep(0) // 설문조사 첫 단계로 초기화
    setAnswers({}) // 답변 초기화
    setRecommendationData(null) // 추천 데이터 초기화
    setIsLoading(false) // 로딩 상태 초기화
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center py-12">
      {showLandingPage ? (
        <LandingPage onStartSurvey={handleStartSurvey} />
      ) : isLoading ? (
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-1/2 mb-8 mx-auto" />
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-12 w-full mb-6" />
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      ) : recommendationData ? (
        <TravelResultsDisplay
          recommendedDestinations={recommendationData.recommendedDestinations}
          itineraries={recommendationData.itineraries}
          summary={recommendationData.summary}
          onReset={handleReset}
        />
      ) : (
        <div className="container mx-auto px-4">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block text-sky-600">갈래 말래</span>
              <span className="block">
                질문에 답해주세요 ({currentStep + 1}/{questions.length})
              </span>
            </h1>
            <p className="mt-2 text-lg text-gray-600">당신에게 딱 맞는 여행지를 찾아드립니다.</p>
          </header>
          <main>
            <QuestionPage
              question={currentQuestion}
              currentAnswer={answers[currentQuestion.id] || null}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
              onNext={handleNext}
              onPrev={handlePrev}
              isLastQuestion={currentStep === questions.length - 1}
              isFirstQuestion={currentStep === 0}
              isSubmitting={isLoading}
            />
          </main>
        </div>
      )}
    </div>
  )
}
