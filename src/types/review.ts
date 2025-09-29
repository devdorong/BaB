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
  한식: { tagBg: 'bg-babcategory-koreanbg', tagText: 'text-babcategory-koreantext' },
  중식: { tagBg: 'bg-babcategory-chinesebg', tagText: 'text-babcategory-chinesetext' },
  일식: { tagBg: 'bg-babcategory-japanesbg', tagText: 'text-babcategory-japanestext' },
  양식: { tagBg: 'bg-babcategory-italianbg', tagText: 'text-babcategory-italiantext' },
  분식: { tagBg: 'bg-babcategory-kfoodbg', tagText: 'text-babcategory-kfoodtext' },
  아시안: { tagBg: 'bg-babcategory-asianbg', tagText: 'text-babcategory-asiantext' },
  인도: { tagBg: 'bg-babcategory-indianbg', tagText: 'text-babcategory-indiantext' },
  멕시칸: { tagBg: 'bg-babcategory-mexicanbg', tagText: 'text-babcategory-mexicantext' },
};
export const mockReviews: Review[] = [
  {
    id: '1',
    name: '크리스피크림도넛 대구동성로중앙점',
    category: '분식',
    img: '/sample.jpg',
    review:
      '부드럽고 달콤한 도넛이 대표인 매장으로, 특히 오리지널 글레이즈드가 인기입니다. 밝은 분위기와 친절한 서비스로 머물기 좋은 공간입니다.',
    rating: 4.6,
    distance: '16m',
    ...categoryColors['분식'],
  },
  {
    id: '2',
    name: '밥장인 동성로점',
    category: '한식',
    img: '/sample.jpg',
    review:
      '정갈한 반찬과 푸짐한 한식 메뉴가 준비된 식당입니다. 국물 요리의 깊은 맛이 돋보이며 가족과 함께 방문하기에 좋은 곳입니다.',
    rating: 4.2,
    distance: '21m',
    ...categoryColors['한식'],
  },
  {
    id: '3',
    name: '한떡봉',
    category: '분식',
    img: '/sample.jpg',
    review:
      '매콤달콤한 떡볶이와 바삭한 튀김이 어울리는 분식집입니다. 쫄깃한 떡 식감이 매력적이며 간단히 즐기기 좋은 메뉴 구성이 돋보입니다.',
    rating: 4.4,
    distance: '22m',
    ...categoryColors['분식'],
  },
  {
    id: '4',
    name: '대동어묵',
    category: '분식',
    img: '/sample.jpg',
    review:
      '탱글한 어묵과 깊은 국물 맛이 특징인 곳으로, 다양한 어묵을 골라먹는 재미가 있습니다. 추운 날씨에 특히 잘 어울리는 분식집입니다.',
    rating: 4.1,
    distance: '26m',
    ...categoryColors['분식'],
  },
  {
    id: '5',
    name: '버거킹 대구중앙로점',
    category: '양식',
    img: '/sample.jpg',
    review:
      '두툼한 패티와 바삭한 감자튀김이 인기인 패스트푸드 매장입니다. 깔끔하게 관리되는 환경 덕분에 안심하고 즐길 수 있습니다.',
    rating: 4.0,
    distance: '37m',
    ...categoryColors['양식'],
  },
  {
    id: '6',
    name: '따끈따끈베이커리',
    category: '분식',
    img: '/sample.jpg',
    review:
      '갓 구운 소금빵과 크루아상 등 다양한 빵이 매력적인 베이커리입니다. 고소하고 부드러운 맛이 커피와 잘 어울려 가볍게 들르기 좋습니다.',
    rating: 4.3,
    distance: '46m',
    ...categoryColors['분식'],
  },
  {
    id: '7',
    name: '후루루탕탕',
    category: '분식',
    img: '/sample.jpg',
    review:
      '다양한 국물과 면 요리를 즐길 수 있는 분식집입니다. 사이드 메뉴도 풍부해 여럿이 함께 방문하기 좋으며 밝은 분위기가 특징입니다.',
    rating: 3.9,
    distance: '47m',
    ...categoryColors['분식'],
  },
  {
    id: '8',
    name: '킹스꼬마김밥 동성로점',
    category: '분식',
    img: '/sample.jpg',
    review:
      '한 입 크기의 꼬마김밥이 인기인 매장입니다. 신선한 재료와 다양한 메뉴 조합으로 부담 없이 즐길 수 있는 간편한 식사 공간입니다.',
    rating: 4.5,
    distance: '48m',
    ...categoryColors['분식'],
  },
  {
    id: '9',
    name: '투고런치',
    category: '한식',
    img: '/sample.jpg',
    review:
      '도시락 스타일의 한식을 제공하는 곳으로, 채소와 고기의 균형이 좋아 건강하게 즐길 수 있습니다. 바쁜 직장인들에게 특히 적합합니다.',
    rating: 4.0,
    distance: '52m',
    ...categoryColors['한식'],
  },
  {
    id: '10',
    name: '칸다소바 대구동성로점',
    category: '일식',
    img: '/sample.jpg',
    review:
      '진한 라멘 국물과 쫄깃한 면발이 조화를 이루는 일식 전문점입니다. 푸짐한 고명과 현지 분위기로 라멘을 좋아하는 분께 추천됩니다.',
    rating: 4.7,
    distance: '54m',
    ...categoryColors['일식'],
  },
  {
    id: '11',
    name: '박가네소갈비찜 대구점',
    category: '한식',
    img: '/sample.jpg',
    review:
      '부드러운 갈비찜과 정갈한 밑반찬이 매력적인 한식집입니다. 양이 푸짐하고 진한 양념이 인상적이며 가족 모임 장소로 적합합니다.',
    rating: 4.8,
    distance: '55m',
    ...categoryColors['한식'],
  },
  {
    id: '12',
    name: '동성로육개장',
    category: '한식',
    img: '/sample.jpg',
    review:
      '얼큰하고 진한 국물이 속을 풀어주는 육개장 전문점입니다. 고기가 넉넉히 들어가 든든하게 한 끼 식사하기에 적합한 곳입니다.',
    rating: 4.2,
    distance: '55m',
    ...categoryColors['한식'],
  },
  {
    id: '13',
    name: '뉴욕비',
    category: '양식',
    img: '/sample.jpg',
    review:
      '세련된 분위기 속에서 파스타와 스테이크를 즐길 수 있는 레스토랑입니다. 플레이팅이 예쁘고 음식 퀄리티가 높아 데이트 장소로 좋습니다.',
    rating: 4.1,
    distance: '56m',
    ...categoryColors['양식'],
  },
  {
    id: '14',
    name: '구르메쇼쿠도 종로직영점',
    category: '일식',
    img: '/sample.jpg',
    review:
      '신선한 샤브샤브와 깊은 육수 맛을 즐길 수 있는 곳입니다. 다양한 채소와 함께 건강한 식사를 할 수 있으며 조용한 분위기가 특징입니다.',
    rating: 4.4,
    distance: '57m',
    ...categoryColors['일식'],
  },
  {
    id: '15',
    name: '샐러디 대구동성로점',
    category: '아시안',
    img: '/sample.jpg',
    review:
      '신선한 샐러드와 다양한 드레싱으로 건강한 식사를 제공하는 매장입니다. 양도 넉넉해 식사 대용으로 찾기 좋으며 가볍게 즐기기 좋습니다.',
    rating: 4.3,
    distance: '62m',
    ...categoryColors['아시안'],
  },
  {
    id: '16',
    name: '삼송빵집 본점',
    category: '분식',
    img: '/sample.jpg',
    review:
      '촉촉한 단팥빵으로 유명한 전통 빵집입니다. 오랜 역사가 느껴지는 깊은 맛과 늘 붐비는 매장 분위기가 매력적인 명소입니다.',
    rating: 4.6,
    distance: '62m',
    ...categoryColors['분식'],
  },
  {
    id: '17',
    name: '맘스터치 신대구중앙로점',
    category: '양식',
    img: '/sample.jpg',
    review:
      '크고 바삭한 치킨버거와 푸짐한 사이드 메뉴가 인기인 매장입니다. 학생들에게 사랑받는 메뉴 구성으로 배부르게 즐길 수 있습니다.',
    rating: 4.0,
    distance: '63m',
    ...categoryColors['양식'],
  },
  {
    id: '18',
    name: '스노우피',
    category: '일식',
    img: '/sample.jpg',
    review:
      '신선한 초밥과 다양한 메뉴 구성이 돋보이는 일식 전문점입니다. 깔끔하고 쾌적한 분위기로 데이트 장소로도 잘 어울립니다.',
    rating: 4.5,
    distance: '68m',
    ...categoryColors['일식'],
  },
  {
    id: '19',
    name: '본죽&비빔밥cafe 대구동성로중앙점',
    category: '한식',
    img: '/sample.jpg',
    review:
      '따뜻한 죽과 담백한 비빔밥을 즐길 수 있는 매장입니다. 가볍게 먹기 좋은 메뉴들이 준비되어 있어 편안한 한 끼로 적합합니다.',
    rating: 4.3,
    distance: '69m',
    ...categoryColors['한식'],
  },
  {
    id: '20',
    name: '슈블랑',
    category: '분식',
    img: '/sample.jpg',
    review:
      '다양한 케이크와 디저트를 제공하는 카페형 매장입니다. 크림이 부드럽고 과하지 않아 부담 없이 즐길 수 있으며 차분한 분위기가 특징입니다.',
    rating: 4.1,
    distance: '72m',
    ...categoryColors['분식'],
  },
  {
    id: '21',
    name: '칭베이훠궈양꼬치',
    category: '중식',
    img: '/sample.jpg',
    review:
      '양꼬치와 마라탕이 인기인 중식 전문점입니다. 얼얼하면서도 깊은 국물 맛이 술안주로 잘 어울리며 활기찬 분위기가 매력적입니다.',
    rating: 4.4,
    distance: '74m',
    ...categoryColors['중식'],
  },
  {
    id: '22',
    name: '단석가 찰보리빵 동성로점',
    category: '분식',
    img: '/sample.jpg',
    review:
      '쫄깃하고 담백한 찰보리빵이 대표 메뉴입니다. 남녀노소 누구나 좋아할 맛으로 선물용으로도 좋으며 정겨운 매장 분위기를 느낄 수 있습니다.',
    rating: 4.2,
    distance: '76m',
    ...categoryColors['분식'],
  },
  {
    id: '23',
    name: '마리포사 동성로점',
    category: '분식',
    img: '/sample.jpg',
    review:
      '다양한 베이커리와 신선한 생크림 디저트가 인기인 곳입니다. 카페처럼 여유롭게 즐길 수 있는 분위기로 달콤한 시간을 보낼 수 있습니다.',
    rating: 4.0,
    distance: '86m',
    ...categoryColors['분식'],
  },
  {
    id: '24',
    name: '전주단지네 대구동성로점',
    category: '한식',
    img: '/sample.jpg',
    review:
      '진하고 구수한 국밥이 인기인 한식집입니다. 푸짐한 고기와 따뜻한 집밥 같은 맛으로 합리적인 가격에 든든하게 즐길 수 있습니다.',
    rating: 4.3,
    distance: '87m',
    ...categoryColors['한식'],
  },
  {
    id: '25',
    name: '신룽푸마라탕 대구동성로점',
    category: '중식',
    img: '/sample.jpg',
    review:
      '얼얼하면서 깊은 맛의 마라탕을 즐길 수 있는 전문점입니다. 신선한 재료를 원하는 대로 고를 수 있어 매운맛을 좋아하는 분들께 추천됩니다.',
    rating: 4.5,
    distance: '87m',
    ...categoryColors['중식'],
  },
  {
    id: '26',
    name: '요요아이스크림',
    category: '분식',
    img: '/sample.jpg',
    review:
      '진하고 풍부한 맛의 아이스크림 전문점입니다. 다양한 토핑을 선택할 수 있어 취향에 맞게 즐길 수 있으며 더운 날 방문하기 좋습니다.',
    rating: 4.2,
    distance: '88m',
    ...categoryColors['분식'],
  },
  {
    id: '27',
    name: '공주당',
    category: '분식',
    img: '/sample.jpg',
    review:
      '부드럽고 고소한 빵과 다양한 디저트를 제공하는 곳입니다. 깔끔한 맛으로 선물용으로도 적합하며 기분 좋게 즐길 수 있습니다.',
    rating: 4.1,
    distance: '88m',
    ...categoryColors['분식'],
  },
  {
    id: '28',
    name: '몽실2 대구종로본점',
    category: '한식',
    img: '/sample.jpg',
    review:
      '정성스럽게 차려진 한식 메뉴가 특징인 식당입니다. 전통적인 맛을 현대적으로 재해석한 풍성한 요리로 분위기 좋은 식사를 즐길 수 있습니다.',
    rating: 4.0,
    distance: '89m',
    ...categoryColors['한식'],
  },
  {
    id: '29',
    name: '파스타코코',
    category: '양식',
    img: '/sample.jpg',
    review:
      '알덴테로 삶은 파스타와 진한 소스가 어울리는 양식 전문점입니다. 신선한 재료와 와인과의 조합이 매력적인 고급스러운 레스토랑입니다.',
    rating: 4.7,
    distance: '90m',
    ...categoryColors['양식'],
  },
  {
    id: '30',
    name: '뜨불 스테이크',
    category: '양식',
    img: '/sample.jpg',
    review:
      '부드럽고 육즙 가득한 스테이크가 대표 메뉴입니다. 고급스러운 플레이팅과 친절한 서비스로 특별한 날 방문하기 좋은 레스토랑입니다.',
    rating: 4.8,
    distance: '90m',
    ...categoryColors['양식'],
  },
  {
    id: '31',
    name: '미진분식',
    category: '분식',
    img: '/sample.jpg',
    review:
      '간단하면서도 푸짐한 메뉴로 사랑받는 동성로 분식집입니다. 부담 없는 가격과 정겨운 분위기로 학생과 직장인 모두 즐겨 찾는 공간입니다.',
    rating: 4.2,
    distance: '92m',
    ...categoryColors['분식'],
  },
  {
    id: '32',
    name: '마차이짬뽕 중앙로점',
    category: '중식',
    img: '/sample.jpg',
    review:
      '얼큰하고 시원한 국물의 짬뽕 전문점입니다. 불향 가득한 요리와 푸짐한 해물이 매력적이며 점심시간에 특히 인기가 많습니다.',
    rating: 4.5,
    distance: '94m',
    ...categoryColors['중식'],
  },
  {
    id: '33',
    name: '종로국수',
    category: '한식',
    img: '/sample.jpg',
    review:
      '정겨운 국수 한 그릇을 즐길 수 있는 곳으로, 따뜻한 국물 맛과 가성비 좋은 메뉴가 특징입니다. 간단히 한 끼 하기 좋은 분위기입니다.',
    rating: 4.0,
    distance: '94m',
    ...categoryColors['한식'],
  },
  {
    id: '34',
    name: '춘천닭갈비1985',
    category: '한식',
    img: '/sample.jpg',
    review:
      '매콤한 양념과 철판에 구워낸 닭갈비가 인기인 매장입니다. 푸짐한 양과 특유의 불맛 덕분에 단체 모임이나 가족 외식에도 잘 어울립니다.',
    rating: 4.4,
    distance: '96m',
    ...categoryColors['한식'],
  },
  {
    id: '35',
    name: '백록식당',
    category: '한식',
    img: '/sample.jpg',
    review:
      '진골목에 위치한 정겨운 한식집으로, 소박하면서도 맛깔스러운 밥상을 제공합니다. 지역민들에게 오랜 사랑을 받아온 식당입니다.',
    rating: 4.1,
    distance: '97m',
    ...categoryColors['한식'],
  },
  {
    id: '36',
    name: '미성회초밥',
    category: '일식',
    img: '/sample.jpg',
    review:
      '신선한 재료로 만든 초밥과 롤을 즐길 수 있는 일식집입니다. 합리적인 가격과 깔끔한 플레이팅으로 식사 만족도가 높은 곳입니다.',
    rating: 4.3,
    distance: '100m',
    ...categoryColors['일식'],
  },
  {
    id: '37',
    name: '멜티코 동성로점',
    category: '분식',
    img: '/sample.jpg',
    review:
      '다양한 아이스크림과 디저트를 맛볼 수 있는 간식 전문점입니다. 독특한 토핑과 달콤한 맛으로 젊은 층에게 특히 인기 있는 공간입니다.',
    rating: 4.2,
    distance: '102m',
    ...categoryColors['분식'],
  },
  {
    id: '38',
    name: '윤소인 남산고단백장어죽집',
    category: '한식',
    img: '/sample.jpg',
    review:
      '영양 가득한 장어죽을 전문으로 하는 한식당입니다. 부드럽고 진한 맛으로 건강을 챙기려는 손님들에게 좋은 선택지입니다.',
    rating: 4.5,
    distance: '103m',
    ...categoryColors['한식'],
  },
  {
    id: '39',
    name: '또오새우',
    category: '한식',
    img: '/sample.jpg',
    review:
      '신선한 새우 요리를 중심으로 다양한 해산물을 즐길 수 있는 한식집입니다. 깔끔한 맛과 가성비로 해물 애호가들에게 인기 있는 곳입니다.',
    rating: 4.3,
    distance: '103m',
    ...categoryColors['한식'],
  },
  {
    id: '40',
    name: '홍콩반점0410 대구동성로점',
    category: '중식',
    img: '/sample.jpg',
    review:
      '짬뽕과 탕수육으로 잘 알려진 프랜차이즈 중식당입니다. 진한 국물과 가성비 좋은 메뉴 덕분에 많은 사람들이 찾는 인기 매장입니다.',
    rating: 4.0,
    distance: '108m',
    ...categoryColors['중식'],
  },
  {
    id: '41',
    name: '타코비 동성로점',
    category: '일식',
    img: '/sample.jpg',
    review:
      '간단히 즐길 수 있는 타코야키와 일본식 간식을 판매하는 매장입니다. 가볍게 먹기 좋은 메뉴로 길거리 음식의 매력을 느낄 수 있습니다.',
    rating: 4.1,
    distance: '109m',
    ...categoryColors['일식'],
  },
  {
    id: '42',
    name: '소두불식당',
    category: '한식',
    img: '/sample.jpg',
    review:
      '진한 국밥 한 그릇으로 든든하게 식사할 수 있는 전통 한식당입니다. 따뜻한 국물과 넉넉한 양으로 지역민들의 발길이 끊이지 않습니다.',
    rating: 4.2,
    distance: '111m',
    ...categoryColors['한식'],
  },
  {
    id: '43',
    name: '한옥집김치찜',
    category: '한식',
    img: '/sample.jpg',
    review:
      '매콤하고 깊은 맛의 김치찜을 대표 메뉴로 하는 한식집입니다. 정갈한 반찬과 푸짐한 양으로 가족 단위 손님들에게 인기 있는 식당입니다.',
    rating: 4.5,
    distance: '111m',
    ...categoryColors['한식'],
  },
  {
    id: '44',
    name: '해쉬',
    category: '양식',
    img: '/sample.jpg',
    review:
      '이탈리안 요리를 감각적으로 선보이는 양식당입니다. 파스타와 스테이크가 인기 있으며 세련된 분위기로 데이트 장소로도 적합합니다.',
    rating: 4.6,
    distance: '112m',
    ...categoryColors['양식'],
  },
  {
    id: '45',
    name: '라멘81번옥 대구동성로점',
    category: '일식',
    img: '/sample.jpg',
    review:
      '진한 국물과 쫄깃한 면발로 인기 있는 라멘 전문점입니다. 일본식 라멘 특유의 깊은 맛과 깔끔한 분위기로 식사 만족도가 높습니다.',
    rating: 4.7,
    distance: '92m',
    ...categoryColors['일식'],
  },
];
