import { NextResponse } from "next/server"

// 더 다양한 여행지 데이터 추가
const destinations = [
  {
    id: 1,
    name: "제주도",
    description: "아름다운 자연과 독특한 문화가 어우러진 한국의 대표 휴양지",
    image: "/placeholder.svg?height=400&width=600",
    climate: "쾌적함", // pleasant
    landscape: "beach",
    bestFor: ["relaxation", "sightseeing", "food"], // activities -> bestFor로 변경
    budget: "중간",
  },
  {
    id: 2,
    name: "방콕",
    description: "활기찬 도시 생활과 풍부한 문화 유산을 경험할 수 있는 태국의 수도",
    image: "/placeholder.svg?height=400&width=600",
    climate: "따뜻함", // warm
    landscape: "city", // 새로운 카테고리 추가
    bestFor: ["culture", "food", "shopping", "intensive"], // activities -> bestFor로 변경
    budget: "저렴",
  },
  {
    id: 3,
    name: "교토",
    description: "전통적인 일본 문화와 아름다운 사찰을 경험할 수 있는 고도",
    image: "/placeholder.svg?height=400&width=600",
    climate: "쾌적함", // pleasant
    landscape: "mountain_forest", // 사찰 주변 숲 등
    bestFor: ["culture", "sightseeing", "food"], // activities -> bestFor로 변경
    budget: "높음",
  },
  {
    id: 4,
    name: "스위스 알프스",
    description: "웅장한 산맥과 맑은 호수가 어우러진 자연의 보고",
    image: "/placeholder.svg?height=400&width=600",
    climate: "선선함", // cool
    landscape: "mountain_forest",
    bestFor: ["nature", "adventure", "relaxation"], // activities -> bestFor로 변경
    budget: "높음",
  },
  {
    id: 5,
    name: "하와이",
    description: "아름다운 해변과 화산 활동을 경험할 수 있는 태평양의 낙원",
    image: "/placeholder.svg?height=400&width=600",
    climate: "따뜻함", // warm
    landscape: "beach",
    bestFor: ["relaxation", "nature", "adventure"], // activities -> bestFor로 변경
    budget: "높음",
  },
  {
    id: 6,
    name: "뉴욕",
    description: "세계 문화와 금융의 중심지, 잠들지 않는 도시",
    image: "/placeholder.svg?height=400&width=600",
    climate: "보통", // temperate
    landscape: "city",
    bestFor: ["sightseeing", "shopping", "food", "culture"], // activities -> bestFor로 변경
    budget: "매우 높음",
  },
  {
    id: 7,
    name: "베트남 하롱베이",
    description: "에메랄드빛 바다와 기암괴석이 어우러진 유네스코 세계유산",
    image: "/placeholder.svg?height=400&width=600",
    climate: "따뜻함", // warm
    landscape: "beach",
    bestFor: ["nature", "relaxation", "food"], // activities -> bestFor로 변경
    budget: "저렴",
  },
  {
    id: 8,
    name: "캐나다 밴프",
    description: "로키 산맥의 보석, 웅장한 자연 경관과 야외 활동의 천국",
    image: "/placeholder.svg?height=400&width=600",
    climate: "추위", // cold
    landscape: "mountain_forest",
    bestFor: ["nature", "adventure", "relaxation"], // activities -> bestFor로 변경
    budget: "높음",
  },
]

// 각 여행지에 대한 기본 일정 템플릿 (실제로는 더 상세하게 구성)
const baseItineraries: { [key: number]: any[] } = {
  1: [
    {
      day: 1,
      activities: [
        { time: "오전", title: "제주공항 도착 및 렌터카 수령", description: "제주 여행 시작" },
        { time: "오후", title: "동부 해안도로 드라이브", description: "성산일출봉, 섭지코지 방문" },
        { time: "저녁", title: "흑돼지 맛집 탐방", description: "제주 대표 음식" },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "오전", title: "한라산 등반 (성판악 코스)", description: "제주 자연 만끽" },
        { time: "오후", title: "서귀포 매일올레시장 구경", description: "현지 분위기 체험" },
        { time: "저녁", title: "서귀포 횟집에서 해산물", description: "싱싱한 해산물" },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "오전", title: "오설록 티 뮤지엄 방문", description: "녹차밭 풍경 감상" },
        { time: "오후", title: "애월 카페거리 산책", description: "아름다운 해변 카페" },
        { time: "저녁", title: "공항 근처 기념품 쇼핑", description: "여행 마무리" },
      ],
    },
  ],
  2: [
    {
      day: 1,
      activities: [
        { time: "오전", title: "방콕 도착 및 호텔 체크인", description: "활기찬 도시의 시작" },
        { time: "오후", title: "왓 아룬, 왓 포 등 사원 투어", description: "태국 불교 문화 체험" },
        { time: "저녁", title: "카오산 로드에서 길거리 음식", description: "현지 분위기 만끽" },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "오전", title: "짜뚜짝 주말 시장 쇼핑", description: "다양한 물건 구경" },
        { time: "오후", title: "마사지 체험 및 휴식", description: "여행의 피로 풀기" },
        { time: "저녁", title: "루프탑 바에서 야경 감상", description: "방콕의 아름다운 밤" },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "오전", title: "담넌사두억 수상시장 방문", description: "이색적인 수상 시장 체험" },
        { time: "오후", title: "쿠킹 클래스 참여", description: "태국 음식 배우기" },
        { time: "저녁", title: "공항으로 이동", description: "여행 마무리" },
      ],
    },
  ],
  3: [
    {
      day: 1,
      activities: [
        { time: "오전", title: "교토 도착 및 료칸 체크인", description: "일본 전통 숙박 체험" },
        { time: "오후", title: "기요미즈데라, 후시미 이나리 신사 방문", description: "교토의 대표 사찰" },
        { time: "저녁", title: "가이세키 요리 체험", description: "일본 전통 코스 요리" },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "오전", title: "아라시야마 대나무 숲 산책", description: "자연 속 힐링" },
        { time: "오후", title: "금각사, 은각사 방문", description: "아름다운 정원과 건축물" },
        { time: "저녁", title: "폰토초에서 이자카야 체험", description: "현지 술집 분위기" },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "오전", title: "니시키 시장 구경", description: "교토의 부엌" },
        { time: "오후", title: "기온 거리 산책 및 기념품 쇼핑", description: "게이샤 거리" },
        { time: "저녁", title: "공항으로 이동", description: "여행 마무리" },
      ],
    },
  ],
  4: [
    {
      day: 1,
      activities: [
        { time: "오전", title: "취리히 도착 및 인터라켄 이동", description: "알프스 여행 시작" },
        { time: "오후", title: "패러글라이딩 체험", description: "알프스 상공에서 스릴 만끽" },
        { time: "저녁", title: "인터라켄 시내 구경", description: "아름다운 마을" },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "오전", title: "융프라우요흐 등정", description: "유럽의 지붕" },
        { time: "오후", title: "피르스트 펀 어드벤처", description: "클리프 워크, 짚라인 등" },
        { time: "저녁", title: "스위스 전통 퐁듀", description: "치즈 퐁듀 체험" },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "오전", title: "루체른 호수 유람선 탑승", description: "아름다운 호수 풍경" },
        { time: "오후", title: "카펠교, 빈사의 사자상 방문", description: "루체른 관광" },
        { time: "저녁", title: "공항으로 이동", description: "여행 마무리" },
      ],
    },
  ],
  5: [
    {
      day: 1,
      activities: [
        { time: "오전", title: "호놀룰루 도착 및 와이키키 해변", description: "하와이 여행 시작" },
        { time: "오후", title: "서핑 강습 또는 해변 휴식", description: "하와이의 상징" },
        { time: "저녁", title: "루아우 쇼 관람", description: "하와이 전통 공연과 음식" },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "오전", title: "다이아몬드 헤드 하이킹", description: "호놀룰루 전경 감상" },
        { time: "오후", title: "진주만 방문", description: "역사적인 장소" },
        { time: "저녁", title: "현지 해산물 레스토랑", description: "신선한 해산물" },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "오전", title: "노스 쇼어 드라이브", description: "거대한 파도와 서핑 명소" },
        { time: "오후", title: "돌 플랜테이션 방문", description: "파인애플 농장" },
        { time: "저녁", title: "공항으로 이동", description: "여행 마무리" },
      ],
    },
  ],
  6: [
    {
      day: 1,
      activities: [
        { time: "오전", title: "뉴욕 도착 및 타임스퀘어 방문", description: "도시의 심장부" },
        { time: "오후", title: "브로드웨이 뮤지컬 관람", description: "세계 최고 수준의 공연" },
        { time: "저녁", title: "맨해튼 레스토랑에서 식사", description: "다양한 미식 경험" },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "오전", title: "자유의 여신상, 엠파이어 스테이트 빌딩", description: "뉴욕의 상징" },
        { time: "오후", title: "센트럴 파크 산책", description: "도심 속 휴식 공간" },
        { time: "저녁", title: "재즈 클럽 또는 라이브 음악", description: "뉴욕의 밤문화" },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "오전", title: "메트로폴리탄 미술관 또는 MoMA", description: "세계적인 박물관" },
        { time: "오후", title: "소호, 그리니치 빌리지 쇼핑", description: "트렌디한 거리" },
        { time: "저녁", title: "공항으로 이동", description: "여행 마무리" },
      ],
    },
  ],
  7: [
    {
      day: 1,
      activities: [
        { time: "오전", title: "하노이 도착 및 하롱베이 이동", description: "베트남의 자연 경관" },
        { time: "오후", title: "크루즈 탑승 및 석회암 동굴 탐험", description: "아름다운 풍경 감상" },
        { time: "저녁", title: "크루즈 내 식사 및 휴식", description: "선상에서의 특별한 밤" },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "오전", title: "티톱섬 전망대 방문", description: "하롱베이 파노라마 뷰" },
        { time: "오후", title: "카약 또는 대나무 보트 체험", description: "바다 위 활동" },
        { time: "저녁", title: "하노이로 복귀 및 현지 식사", description: "베트남 음식" },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "오전", title: "하노이 구시가지 투어", description: "호안끼엠 호수, 성요셉 성당" },
        { time: "오후", title: "분짜, 쌀국수 등 현지 음식 탐방", description: "베트남 미식" },
        { time: "저녁", title: "공항으로 이동", description: "여행 마무리" },
      ],
    },
  ],
  8: [
    {
      day: 1,
      activities: [
        { time: "오전", title: "캘거리 도착 및 밴프 이동", description: "로키 산맥 여행 시작" },
        { time: "오후", title: "밴프 어퍼 핫 스프링스 온천", description: "자연 속 온천" },
        { time: "저녁", title: "밴프 타운 구경 및 식사", description: "아기자기한 마을" },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "오전", title: "레이크 루이스, 모레인 레이크 방문", description: "에메랄드빛 호수" },
        { time: "오후", title: "곤돌라 탑승 및 설퍼 산 전망대", description: "웅장한 산맥 감상" },
        { time: "저녁", title: "스테이크 또는 캐나다 음식", description: "현지 특산물" },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "오전", title: "존스턴 캐년 하이킹", description: "아름다운 계곡 트레킹" },
        { time: "오후", title: "보우 폭포, 후두스 방문", description: "자연 명소" },
        { time: "저녁", title: "공항으로 이동", description: "여행 마무리" },
      ],
    },
  ],
}

export async function POST(request: Request) {
  try {
    const answers = await request.json()
    console.log("Received answers:", answers)

    const { q1, q2, q3, q4, q5, q6, q7 } = answers

    // 간단한 추천 로직: 질문 답변에 따라 점수를 매겨 상위 3개 추천
    const scoredDestinations = destinations.map((dest) => {
      let score = 0

      // Q1: 관광 명소 탐방 vs 휴양 및 휴식
      if (q1 === "sightseeing" && dest.bestFor.includes("sightseeing")) score += 2
      if (q1 === "relaxation" && dest.bestFor.includes("relaxation")) score += 2

      // Q2: 해변 vs 산/숲
      if (q2 === "beach" && dest.landscape === "beach") score += 2
      if (q2 === "mountain_forest" && dest.landscape === "mountain_forest") score += 2

      // Q3: 여행 동행자 (모든 여행지가 대부분의 동행자에게 적합하다고 가정)
      // 이 질문은 직접적인 여행지 필터링보다 일정 조정에 더 유용할 수 있음
      // 여기서는 간단히 점수 부여
      if (q3 === "family" && dest.id === 1) score += 1 // 제주도는 가족 여행에 좋음
      if (q3 === "couple" && dest.id === 5) score += 1 // 하와이는 연인 여행에 좋음

      // Q4: 방문하고 싶은 기후
      if (q4 === dest.climate) score += 3 // 기후는 중요도가 높다고 가정

      // Q5: 식도락 여행 (bestFor에 포함된 경우)
      if (q5 === "traditional_food" && dest.bestFor.includes("food")) score += 1
      if (q5 === "fusion_cuisine" && dest.bestFor.includes("food")) score += 1
      if (q5 === "street_food" && dest.bestFor.includes("food")) score += 1
      if (q5 === "vegetarian_vegan" && dest.bestFor.includes("food")) score += 1

      // Q7: 여행 페이스 (bestFor에 포함된 경우)
      if (q7 === "intensive" && dest.bestFor.includes("intensive")) score += 1
      if (q7 === "relaxed" && dest.bestFor.includes("relaxation")) score += 1

      return { ...dest, score }
    })

    // 점수 기준으로 내림차순 정렬 후 상위 3개 선택
    const top3Destinations = scoredDestinations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ score, ...rest }) => rest) // score 필드 제거

    // 선택된 3개 여행지에 대한 일정 가져오기
    const itineraries: { [key: number]: any[] } = {}
    top3Destinations.forEach((dest) => {
      itineraries[dest.id] = baseItineraries[dest.id] || [] // 해당 여행지의 기본 일정
    })

    // 1.5초 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({ recommendedDestinations: top3Destinations, itineraries }, { status: 200 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ message: "여행 추천 중 오류가 발생했습니다." }, { status: 500 })
  }
}
