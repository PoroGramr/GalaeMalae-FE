"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Plane } from "lucide-react"
import { useState } from "react"

interface QuestionPageProps {
  question: {
    id: string
    question: string
    options: { value: string; label: string }[]
  }
  currentAnswer: string | null
  onAnswer: (answer: string) => void
  onNext: () => void
  onPrev: () => void
  isLastQuestion: boolean
  isFirstQuestion: boolean
  isSubmitting: boolean
}

export function QuestionPage({
  question,
  currentAnswer,
  onAnswer,
  onNext,
  onPrev,
  isLastQuestion,
  isFirstQuestion,
  isSubmitting,
}: QuestionPageProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(currentAnswer)

  const handleValueChange = (value: string) => {
    setSelectedOption(value)
    onAnswer(value)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption || ""} onValueChange={handleValueChange} className="space-y-4">
          {question.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-lg cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onPrev} disabled={isFirstQuestion || isSubmitting} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> 이전
        </Button>
        <Button onClick={onNext} disabled={!selectedOption || isSubmitting} className="min-w-[120px]">
          {isLastQuestion ? (
            <>
              <Plane className="mr-2 h-4 w-4" />
              {isSubmitting ? "추천 중..." : "여행 추천 받기"}
            </>
          ) : (
            <>
              다음 <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
