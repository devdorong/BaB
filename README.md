# BaB 프로젝트

# 팀원

- 팀장 : 전도현
- 팀원 : 김지양, 신동재

# 구조

- Pages 파일은 rfce
- components 는 rafce
- 스타일은 tailwind, emotion 사용
- 백엔드는 supabase 사용(타입 포함)

# 개발환경

## 폰트패밀리

- Noto Sans Korean

## 프론트

- React Vite
- TypeScript
- Figma
- css

## 백엔드

- SupaBase

# 협업 툴

- Slack
- Notion
- GitHub

# 라이브러리

- tailwind
- nivochart
- antdesign
- kakao map
- swiper
- react-paginate

# 일정

- 2025.08.25 프로젝트 기본구성 세팅
- 2025.08.26 프로젝트 기본 파일 구조 설정
- 2025.09.03 프로젝트 추가 구성 및 세팅
- 2025.09.09 피그마 작업 완료, supabase

- 2025.09.12 라우터 구조 세팅

# 문제해결과정

## 1. TS 에서 Emotion 스타일 사용안되는 문제

- TypeScript 에서 Emotion 스타일을 쓰려했으나, 직접 import 해주지않으면 불러와지지 않는 문제가 발생
- 해결 : ts 전용 styled-componets 를 불러오니 해결되었다...

```bash
npm install styled-components
npm install --save-dev @types/styled-components  # TS 쓰는 경우
```
