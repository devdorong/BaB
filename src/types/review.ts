export interface Review {
  id: string;
  name: string;
  category: string;
  img: string;
  review: string;
  rating: number;
  distance: string;
  tagBg?: string;
  tagText?: string;
}

const categoryColors: Record<string, { tagBg: string; tagText: string }> = {
  한식: { tagBg: "bg-babcategory-koreanbg", tagText: "text-babcategory-koreantext" },
  중식: { tagBg: "bg-babcategory-chinesebg", tagText: "text-babcategory-chinesetext" },
  일식: { tagBg: "bg-babcategory-japanesbg", tagText: "text-babcategory-japanestext" },
  양식: { tagBg: "bg-babcategory-italianbg", tagText: "text-babcategory-italiantext" },
  분식: { tagBg: "bg-babcategory-kfoodbg", tagText: "text-babcategory-kfoodtext" },
  아시안: { tagBg: "bg-babcategory-asianbg", tagText: "text-babcategory-asiantext" },
  인도: { tagBg: "bg-babcategory-indianbg", tagText: "text-babcategory-indiantext" },
  멕시칸: { tagBg: "bg-babcategory-mexicanbg", tagText: "text-babcategory-mexicantext" },
};
export const mockReviews: Review[] = [
  {
    id: "1",
    name: "크리스피크림도넛 대구동성로중앙점",
    category: "분식",
    img: "/sample.jpg",
    review:
      "도넛이 정말 달콤하고 부드러워서 입안에서 사르르 녹는 느낌이에요. 매장 분위기도 밝고 직원분들이 친절해서 기분 좋게 머물 수 있었습니다. 특히 오리지널 글레이즈드는 먹어본 사람 모두 인정할 만큼 훌륭했습니다.",
    rating: 4.6,
    distance: "16m",
    ...categoryColors["분식"],
  },
  {
    id: "2",
    name: "밥장인 동성로점",
    category: "한식",
    img: "/sample.jpg",
    review:
      "든든한 한식 한 끼로 손색이 없는 곳입니다. 반찬도 하나하나 정갈하게 나오고 메인 메뉴의 양도 충분해서 배부르게 먹을 수 있습니다. 특히 국물 요리가 깊은 맛을 내서 인상적이었어요. 가족과 함께 방문하기도 좋습니다.",
    rating: 4.2,
    distance: "21m",
    ...categoryColors["한식"],
  },
  {
    id: "3",
    name: "한떡봉",
    category: "분식",
    img: "/sample.jpg",
    review:
      "떡볶이 국물이 매콤달콤하면서도 부담스럽지 않아 자꾸 생각나는 맛입니다. 튀김 메뉴와 함께 주문하면 정말 찰떡궁합이에요. 떡의 쫄깃한 식감이 오래 남고 친구들이랑 간단히 먹기에 최고의 선택입니다.",
    rating: 4.4,
    distance: "22m",
    ...categoryColors["분식"],
  },
  {
    id: "4",
    name: "대동어묵",
    category: "분식",
    img: "/sample.jpg",
    review:
      "어묵이 탱글탱글하고 국물이 진해서 추운 날씨에 특히 생각나는 곳입니다. 다양한 어묵이 준비되어 있어 고르는 재미도 쏠쏠하고, 따뜻한 국물 덕분에 속까지 따뜻해졌습니다. 가성비도 좋아 부담 없이 방문하기 좋습니다.",
    rating: 4.1,
    distance: "26m",
    ...categoryColors["분식"],
  },
  {
    id: "5",
    name: "버거킹 대구중앙로점",
    category: "양식",
    img: "/sample.jpg",
    review:
      "패티가 두툼하고 육즙이 가득해 한 입 먹을 때마다 만족감을 줍니다. 감자튀김은 바삭하고 짭짤해서 햄버거와 완벽하게 어울렸습니다. 매장도 청결하게 관리되고 있어 안심하고 먹을 수 있었습니다.",
    rating: 4.0,
    distance: "37m",
    ...categoryColors["양식"],
  },
  {
    id: "6",
    name: "따끈따끈베이커리",
    category: "분식",
    img: "/sample.jpg",
    review:
      "갓 구운 빵의 향이 매장 가득 퍼져 있어서 들어서는 순간 기분이 좋아집니다. 소금빵, 크루아상 등 다양한 메뉴가 준비되어 있으며, 식감이 부드럽고 맛이 고소해 커피와 함께 즐기기 딱 좋습니다.",
    rating: 4.3,
    distance: "46m",
    ...categoryColors["분식"],
  },
  {
    id: "7",
    name: "후루루탕탕",
    category: "분식",
    img: "/sample.jpg",
    review:
      "이름처럼 재미있는 메뉴 구성이 독특한 분식집입니다. 국물과 면 요리가 조화를 이루며 사이드 메뉴도 다양하게 준비되어 있어 여럿이 함께 가면 좋습니다. 분위기도 밝아 편하게 즐길 수 있었습니다.",
    rating: 3.9,
    distance: "47m",
    ...categoryColors["분식"],
  },
  {
    id: "8",
    name: "킹스꼬마김밥 동성로점",
    category: "분식",
    img: "/sample.jpg",
    review:
      "꼬마김밥이 한 입 크기라 먹기 정말 편리합니다. 안에 들어간 재료들이 신선하고 간도 적당해 부담 없이 먹을 수 있었습니다. 다양한 메뉴가 있어 매번 새로운 조합을 시도할 수 있다는 점도 장점입니다.",
    rating: 4.5,
    distance: "48m",
    ...categoryColors["분식"],
  },
  {
    id: "9",
    name: "투고런치",
    category: "한식",
    img: "/sample.jpg",
    review:
      "도시락 스타일의 한식 메뉴가 준비되어 있어 간편하게 먹기 좋습니다. 채소와 고기의 비율이 적절하고 조미료 맛이 강하지 않아 건강하게 즐길 수 있습니다. 바쁜 직장인에게 딱 알맞은 곳입니다.",
    rating: 4.0,
    distance: "52m",
    ...categoryColors["한식"],
  },
  {
    id: "10",
    name: "칸다소바 대구동성로점",
    category: "일식",
    img: "/sample.jpg",
    review:
      "라멘 국물이 깊고 진해 첫 숟가락부터 감탄이 나왔습니다. 면발은 쫄깃하고 국물과 잘 어울리며, 고명도 푸짐하게 올라가 있어 만족도가 높습니다. 일본 현지 라멘집 분위기를 그대로 옮겨온 듯했습니다.",
    rating: 4.7,
    distance: "54m",
    ...categoryColors["일식"],
  },
  {
    id: "11",
    name: "박가네소갈비찜 대구점",
    category: "한식",
    img: "/sample.jpg",
    review:
      "갈비찜이 입안에서 부드럽게 풀리면서 진한 양념이 잘 배어 있었습니다. 고기가 양도 푸짐하고 밑반찬도 정갈하게 준비되어 있어 전체적으로 만족도가 높았습니다. 가족 모임 장소로 추천할 만합니다.",
    rating: 4.8,
    distance: "55m",
    ...categoryColors["한식"],
  },
  {
    id: "12",
    name: "동성로육개장",
    category: "한식",
    img: "/sample.jpg",
    review:
      "국물이 얼큰하고 진해서 속이 확 풀리는 느낌이었습니다. 고기가 넉넉하게 들어가 있어 든든하게 한 끼 식사하기 좋았습니다. 추운 날씨에 특히 생각나는 메뉴라 재방문할 예정입니다.",
    rating: 4.2,
    distance: "55m",
    ...categoryColors["한식"],
  },
  {
    id: "13",
    name: "뉴욕비",
    category: "양식",
    img: "/sample.jpg",
    review:
      "분위기가 세련되어 데이트 장소로 적합합니다. 파스타와 스테이크 모두 맛있었고 플레이팅도 예뻐서 사진 찍기 좋았습니다. 가격대는 약간 있지만 음식 퀄리티를 생각하면 충분히 만족스러웠습니다.",
    rating: 4.1,
    distance: "56m",
    ...categoryColors["양식"],
  },
  {
    id: "14",
    name: "구르메쇼쿠도 종로직영점",
    category: "일식",
    img: "/sample.jpg",
    review:
      "샤브샤브 고기가 신선하고 육수가 깊은 맛을 냈습니다. 다양한 채소와 함께 먹으니 건강한 느낌도 들어 좋았습니다. 분위기도 조용해서 여유롭게 식사할 수 있었습니다.",
    rating: 4.4,
    distance: "57m",
    ...categoryColors["일식"],
  },
  {
    id: "15",
    name: "샐러디 대구동성로점",
    category: "아시안",
    img: "/sample.jpg",
    review:
      "샐러드 재료가 모두 신선해서 아삭한 식감이 좋았습니다. 드레싱 종류도 다양하고 양도 넉넉해 식사 대용으로 손색이 없었습니다. 건강을 챙기고 싶은 날 자주 찾게 될 것 같습니다.",
    rating: 4.3,
    distance: "62m",
    ...categoryColors["아시안"],
  },
  {
    id: "16",
    name: "삼송빵집 본점",
    category: "분식",
    img: "/sample.jpg",
    review:
      "빵이 촉촉하고 속이 꽉 차 있어서 먹는 내내 만족스러웠습니다. 전통 있는 빵집이라 그런지 맛의 깊이가 다르고, 특히 단팥빵은 꼭 먹어봐야 할 메뉴였습니다. 늘 사람들이 붐비는 이유를 알겠더군요.",
    rating: 4.6,
    distance: "62m",
    ...categoryColors["분식"],
  },
  {
    id: "17",
    name: "맘스터치 신대구중앙로점",
    category: "양식",
    img: "/sample.jpg",
    review:
      "버거 크기가 커서 배부르게 먹을 수 있었고, 치킨 패티가 바삭하고 육즙도 충분했습니다. 사이드 메뉴도 푸짐하게 제공되어 만족스러웠습니다. 학생들에게 인기가 많은 이유를 알겠네요.",
    rating: 4.0,
    distance: "63m",
    ...categoryColors["양식"],
  },
  {
    id: "18",
    name: "스노우피",
    category: "일식",
    img: "/sample.jpg",
    review:
      "초밥이 신선하고 밥과 생선의 밸런스가 아주 좋았습니다. 메뉴 구성이 다양해 여러 가지를 맛볼 수 있어 좋았습니다. 분위기도 깔끔하고 쾌적해서 데이트 장소로도 괜찮습니다.",
    rating: 4.5,
    distance: "68m",
    ...categoryColors["일식"],
  },
  {
    id: "19",
    name: "본죽&비빔밥cafe 대구동성로중앙점",
    category: "한식",
    img: "/sample.jpg",
    review:
      "죽이 따뜻하고 속을 편안하게 해주었습니다. 여러 가지 맛이 준비되어 있어 입맛에 따라 고를 수 있었고, 반찬들도 깔끔하게 나와서 만족스러웠습니다. 가볍게 먹고 싶을 때 추천합니다.",
    rating: 4.3,
    distance: "69m",
    ...categoryColors["한식"],
  },
  {
    id: "20",
    name: "슈블랑",
    category: "분식",
    img: "/sample.jpg",
    review:
      "케이크와 디저트 종류가 다양해 고르는 재미가 있습니다. 크림이 부드럽고 달지 않아 질리지 않고 먹을 수 있었습니다. 카페 분위기도 차분해서 여유롭게 즐기기 좋았습니다.",
    rating: 4.1,
    distance: "72m",
    ...categoryColors["분식"],
  },
  {
    id: "21",
    name: "칭베이훠궈양꼬치",
    category: "중식",
    img: "/sample.jpg",
    review:
      "양꼬치가 부드럽고 잡내가 없어 먹기 편했습니다. 마라탕도 얼얼하면서 깊은 국물 맛이 훌륭했습니다. 친구들과 함께 가서 술안주로 즐기기에 딱 좋은 곳입니다. 분위기도 활기찼습니다.",
    rating: 4.4,
    distance: "74m",
    ...categoryColors["중식"],
  },
  {
    id: "22",
    name: "단석가 찰보리빵 동성로점",
    category: "분식",
    img: "/sample.jpg",
    review:
      "찰보리빵이 쫄깃하고 고소한 맛이 일품입니다. 달지 않고 담백해서 남녀노소 누구나 좋아할 만한 맛입니다. 선물용으로 사가기에도 좋습니다. 매장 분위기도 정겹습니다.",
    rating: 4.2,
    distance: "76m",
    ...categoryColors["분식"],
  },
  {
    id: "23",
    name: "마리포사 동성로점",
    category: "분식",
    img: "/sample.jpg",
    review:
      "베이커리 종류가 다양해서 선택의 폭이 넓습니다. 크루아상, 타르트 모두 맛있었고 특히 생크림이 신선해서 만족스러웠습니다. 카페처럼 여유롭게 즐기기 좋은 곳이었습니다.",
    rating: 4.0,
    distance: "86m",
    ...categoryColors["분식"],
  },
  {
    id: "24",
    name: "전주단지네 대구동성로점",
    category: "한식",
    img: "/sample.jpg",
    review:
      "국밥 국물이 진하고 구수해서 속이 든든해졌습니다. 고기도 많이 들어 있어 푸짐하게 먹을 수 있었습니다. 가격도 합리적이고, 따뜻한 집밥 같은 느낌을 주는 곳입니다.",
    rating: 4.3,
    distance: "87m",
    ...categoryColors["한식"],
  },
  {
    id: "25",
    name: "신룽푸마라탕 대구동성로점",
    category: "중식",
    img: "/sample.jpg",
    review:
      "얼얼한 마라탕 국물이 정말 매력적이었습니다. 재료도 신선하고 원하는 대로 선택할 수 있어 만족스러웠습니다. 매운 음식을 좋아하는 분들께 강력히 추천할 만합니다.",
    rating: 4.5,
    distance: "87m",
    ...categoryColors["중식"],
  },
  {
    id: "26",
    name: "요요아이스크림",
    category: "분식",
    img: "/sample.jpg",
    review:
      "아이스크림이 진하고 풍부한 맛을 자랑했습니다. 다양한 토핑을 선택할 수 있어 취향에 맞게 즐길 수 있었습니다. 더운 날씨에 방문하면 특히 만족스러울 것 같습니다.",
    rating: 4.2,
    distance: "88m",
    ...categoryColors["분식"],
  },
  {
    id: "27",
    name: "공주당",
    category: "분식",
    img: "/sample.jpg",
    review:
      "빵이 부드럽고 고소한 향이 좋아 기분 좋게 먹을 수 있었습니다. 디저트 종류도 다양하고 맛이 깔끔해서 누구나 좋아할 만합니다. 선물용으로도 괜찮은 곳이었습니다.",
    rating: 4.1,
    distance: "88m",
    ...categoryColors["분식"],
  },
  {
    id: "28",
    name: "몽실2 대구종로본점",
    category: "한식",
    img: "/sample.jpg",
    review:
      "분위기 좋은 한식집으로, 정성스럽게 차려진 메뉴들이 인상적이었습니다. 전통적인 맛을 현대적으로 재해석해 깔끔하면서도 풍성한 맛을 느낄 수 있었습니다.",
    rating: 4.0,
    distance: "89m",
    ...categoryColors["한식"],
  },
  {
    id: "29",
    name: "파스타코코",
    category: "양식",
    img: "/sample.jpg",
    review:
      "파스타 면이 알덴테로 삶아져 식감이 좋았습니다. 소스도 진하고 재료가 신선해서 맛의 완성도가 높았습니다. 와인과 함께 즐기면 더할 나위 없이 좋은 식사가 됩니다.",
    rating: 4.7,
    distance: "90m",
    ...categoryColors["양식"],
  },
  {
    id: "30",
    name: "뜨불 스테이크",
    category: "양식",
    img: "/sample.jpg",
    review:
      "스테이크가 부드럽고 육즙이 풍부해서 입안 가득 고소한 맛이 퍼졌습니다. 플레이팅도 고급스럽고 직원분들도 친절해 전체적으로 만족스러운 경험이었습니다. 특별한 날 방문하기 좋습니다.",
    rating: 4.8,
    distance: "90m",
    ...categoryColors["양식"],
  },
];