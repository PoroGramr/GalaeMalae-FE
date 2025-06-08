"use client"

import { useState } from "react"
import { QuestionPage } from "@/components/question-page"
import { TravelResultsDisplay } from "@/components/travel-results-display"
import { Skeleton } from "@/components/ui/skeleton"
import { questions } from "@/lib/questions"
import { LandingPage } from "@/components/landing-page" // LandingPage 임포트

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
        const response = await fetch("/api/recommend-travel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answers),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setRecommendationData({ ...data, summary: answers }) // 답변 요약도 함께 전달
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
