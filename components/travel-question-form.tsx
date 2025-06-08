"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Plane } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  budget: z.string().min(1, { message: "예산을 입력해주세요" }),
  currency: z.string().min(1, { message: "통화를 선택해주세요" }),
  startDate: z.date({ required_error: "출발일을 선택해주세요" }),
  endDate: z.date({ required_error: "도착일을 선택해주세요" }),
  travelStyle: z.string().min(1, { message: "여행 스타일을 선택해주세요" }),
  activities: z.array(z.string()).min(1, { message: "최소 하나의 활동을 선택해주세요" }),
  accommodation: z.string().min(1, { message: "숙박 유형을 선택해주세요" }),
  preferredClimate: z.string().min(1, { message: "선호하는 기후를 선택해주세요" }),
  foodImportance: z.number().min(1).max(5),
  additionalInfo: z.string().optional(),
})

const activities = [
  { id: "sightseeing", label: "관광 명소 방문" },
  { id: "nature", label: "자연/아웃도어 활동" },
  { id: "culture", label: "문화 체험" },
  { id: "food", label: "음식 탐방" },
  { id: "shopping", label: "쇼핑" },
  { id: "relaxation", label: "휴양/휴식" },
  { id: "adventure", label: "모험/스릴 활동" },
]

interface TravelQuestionFormProps {
  onRecommendationReceived: (data: any) => void
}

export function TravelQuestionForm({ onRecommendationReceived }: TravelQuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: "",
      currency: "KRW",
      travelStyle: "",
      activities: [],
      accommodation: "",
      preferredClimate: "",
      foodImportance: 3,
      additionalInfo: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/recommend-travel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      onRecommendationReceived(data) // 부모 컴포넌트로 데이터 전달
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("여행 추천 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>예산</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="예산 금액" {...field} />
                  </FormControl>
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="통화" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KRW">KRW</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <FormDescription>여행에 사용할 총 예산을 입력하세요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>출발일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>도착일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || (form.getValues("startDate") && date < form.getValues("startDate"))
                        }
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="travelStyle"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>여행 스타일</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="relaxed" />
                    </FormControl>
                    <FormLabel className="font-normal">여유로운</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="balanced" />
                    </FormControl>
                    <FormLabel className="font-normal">균형 잡힌</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="intensive" />
                    </FormControl>
                    <FormLabel className="font-normal">알찬</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>여행 일정의 강도를 선택하세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">선호하는 활동</FormLabel>
                <FormDescription>여행 중 즐기고 싶은 활동을 모두 선택하세요.</FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <FormField
                    key={activity.id}
                    control={form.control}
                    name="activities"
                    render={({ field }) => {
                      return (
                        <FormItem key={activity.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(activity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, activity.id])
                                  : field.onChange(field.value?.filter((value) => value !== activity.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{activity.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accommodation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>선호하는 숙박 유형</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="숙박 유형 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hotel">호텔</SelectItem>
                  <SelectItem value="resort">리조트</SelectItem>
                  <SelectItem value="airbnb">에어비앤비/민박</SelectItem>
                  <SelectItem value="hostel">호스텔</SelectItem>
                  <SelectItem value="camping">캠핑</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredClimate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>선호하는 기후</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="기후 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tropical">열대 (따뜻하고 습함)</SelectItem>
                  <SelectItem value="dry">건조 (따뜻하고 건조함)</SelectItem>
                  <SelectItem value="temperate">온대 (온화함)</SelectItem>
                  <SelectItem value="continental">대륙성 (더운 여름, 추운 겨울)</SelectItem>
                  <SelectItem value="polar">한대 (춥고 눈이 많음)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="foodImportance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>음식의 중요도</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                  className="py-4"
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>중요하지 않음</span>
                <span>매우 중요</span>
              </div>
              <FormDescription>여행에서 음식이 얼마나 중요한지 선택하세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>추가 정보</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="여행에 대한 추가 요구사항이나 선호사항을 자유롭게 작성해주세요."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>특별한 요청이나 고려사항이 있다면 알려주세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <Plane className="mr-2 h-4 w-4" />
          {isSubmitting ? "처리 중..." : "여행 계획 받기"}
        </Button>
      </form>
    </Form>
  )
}
