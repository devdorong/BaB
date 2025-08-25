type BaseUser = {
  id: number; // id
  nickname: string; // 닉네임
  email: string; // 이메일
  gender: 'Male' | 'Female'; // 성별
};

type UserProfile = BaseUser & {
  profileImage?: string; // 프로필 이미지
  bio?: string; // 자기소개
  interests?: string[]; // 관심사? 필요할까?
};

type UserSystemInfo = {
  createdAt: Date; // 가입일
  updatedAt: Date; // 수정일
  isActive: boolean; // 회원여부
};

type MatchInfo = {
  preferredFoods?: string[]; // 선호음식
  availableTime?: string[]; // 가능시간대
  rating?: number; // 매너 or 신뢰점수
  matchHistory?: number[]; // 같이 매칭된 ID 목록
};
