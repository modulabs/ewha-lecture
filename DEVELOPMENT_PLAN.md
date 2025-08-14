# 이화여대 AI 과정 React 리팩터링 개발계획서

## 📋 프로젝트 개요

**목적**: 기존 Docsify 기반 문서 사이트를 React + TypeScript로 리팩터링하여 더 나은 UX와 확장성 제공

**기간**: 2025년 8월 14일 시작

**현재 상태**: 🟡 진행 중 (마크다운 파일 경로 이슈 해결 단계)

---

## 🎯 요구사항 및 목표

### 핵심 기능 요구사항
- ✅ **LMS 스타일 네비게이션**: 진행률, 현재 위치 표시
- ✅ **부드러운 사이드바**: 애니메이션으로 접기/펼치기
- ✅ **마크다운 렌더링**: 기존 .md 파일들 그대로 활용
- ✅ **반응형 디자인**: 모바일/태블릿 대응
- ✅ **진행 상태 관리**: 읽은/안읽은 표시

### 기존 Docsify의 한계점
- 사이드바 접기/펼치기 애니메이션 이슈
- 현재 페이지 하이라이팅 부족
- 진행 상태 표시 기능 없음
- 반응형 디자인 제한
- 커스터마이징 어려움

---

## 🛠 기술 스택

### Frontend 핵심
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (새로운 CSS-first 구성)
- **Framer Motion** (애니메이션)
- **React Router v6** (라우팅)
- **Zustand** (상태 관리)

### 마크다운 처리
- **react-markdown** + **remark-gfm**
- **rehype-highlight** (코드 하이라이팅)

### UI 컴포넌트
- **Lucide React** (아이콘)
- **커스텀 컴포넌트** (재사용 가능한 UI)

### 배포
- **GitHub Pages** (정적 빌드)

---

## 📁 프로젝트 구조

```
ewha-react/
├── public/                     # 정적 파일
│   ├── day1/                  # Day 1 마크다운 파일들
│   ├── day2/                  # Day 2 마크다운 파일들
│   ├── day3/                  # Day 3 마크다운 파일들
│   └── lecture_plan.md        # 강의 계획표
├── src/
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── Layout/           # 레이아웃 컴포넌트
│   │   ├── Sidebar/          # 사이드바 관련 컴포넌트
│   │   └── MarkdownRenderer/ # 마크다운 렌더링
│   ├── pages/                # 페이지 컴포넌트
│   ├── store/                # Zustand 상태 관리
│   ├── types/                # TypeScript 타입 정의
│   ├── data/                 # 사이드바 메타데이터
│   └── hooks/                # 커스텀 훅
└── ...구성 파일들
```

---

## ✅ 완료된 작업

### 1. 프로젝트 초기 설정
- ✅ Vite + React + TypeScript 프로젝트 생성
- ✅ 필요한 의존성 패키지 설치
- ✅ Tailwind CSS v4 구성 (새로운 방식)

### 2. 컴포넌트 구현
- ✅ **Layout 컴포넌트**: 전체 레이아웃 구조
- ✅ **Sidebar 컴포넌트**: 반응형 사이드바
- ✅ **SidebarItem 컴포넌트**: 재귀적 네비게이션 아이템
- ✅ **MarkdownRenderer**: 마크다운 파일 렌더링

### 3. 상태 관리
- ✅ **Zustand Store**: 네비게이션 상태 관리
  - 현재 경로 추적
  - 확장된 메뉴 아이템 관리
  - 완료된 아이템 추적
  - 사이드바 열림/닫힘 상태

### 4. 라우팅 시스템
- ✅ **React Router v6**: SPA 라우팅
- ✅ **동적 라우팅**: `/:day/:session` 패턴
- ✅ **404 페이지**: 존재하지 않는 경로 처리

### 5. 해결된 주요 기술 이슈
- ✅ **Tailwind CSS v4 호환성**: `@import "tailwindcss"` 방식 적용
- ✅ **순환 참조 문제**: SidebarItem의 renderChildren 패턴으로 해결
- ✅ **애니메이션 구현**: Framer Motion으로 부드러운 사이드바

---

## 🚧 현재 진행 중

### 마크다운 파일 경로 이슈 해결
**문제**: URL 파라미터와 파일 경로 매핑 오류
- 사이드바 경로: `/day1/01_onboarding`
- 파일 경로 생성: `/day${day}/${session}.md` → 잘못된 경로

**해결 방안**: SessionPage 컴포넌트의 파일 경로 생성 로직 수정
```typescript
// 수정 전: `/day${day}/${session}.md`
// 수정 후: `/${day}/${session}.md` 
```

---

## 📝 남은 작업

### 1. 마크다운 렌더링 완성
- 🔄 파일 경로 매핑 수정
- ⏳ 마크다운 스타일링 최적화
- ⏳ 코드 하이라이팅 구현

### 2. 추가 기능 구현
- ⏳ 이전/다음 페이지 네비게이션
- ⏳ 검색 기능
- ⏳ 다크 모드 지원

### 3. 성능 최적화
- ⏳ 코드 스플리팅
- ⏳ 이미지 최적화
- ⏳ 번들 사이즈 최적화

### 4. 배포 설정
- ⏳ GitHub Pages 설정
- ⏳ CI/CD 파이프라인
- ⏳ 배포 자동화

---

## 🏗 개발 프로세스

### 개발 환경 실행
```bash
cd ewha-react
npm run dev
```

### 빌드 및 배포
```bash
npm run build
npm run preview
```

### 코드 품질 관리
```bash
npm run lint
npm run type-check
```

---

## 📊 진행률

| 영역 | 진행률 | 상태 |
|------|--------|------|
| 프로젝트 설정 | 100% | ✅ |
| 컴포넌트 구현 | 95% | 🟡 |
| 상태 관리 | 100% | ✅ |
| 라우팅 | 100% | ✅ |
| 마크다운 렌더링 | 80% | 🟡 |
| 스타일링 | 90% | 🟡 |
| 배포 준비 | 0% | ⏳ |

**전체 진행률: 약 80%**

---

## 🐛 알려진 이슈

### 1. 마크다운 파일 로딩 (진행 중)
- **현상**: Day 세션 클릭 시 HTML 소스 표시
- **원인**: 파일 경로 매핑 오류
- **해결책**: 파라미터 파싱 로직 수정

### 2. Tailwind CSS v4 호환성 (해결됨)
- **해결**: `@import "tailwindcss"` 방식으로 변경
- **결과**: 정상 작동

### 3. 순환 참조 문제 (해결됨)
- **해결**: renderChildren 패턴 적용
- **결과**: SidebarItem 정상 렌더링

---

## 🔄 다음 스프린트 계획

### Sprint 1: 마크다운 렌더링 완성
1. SessionPage 파일 경로 수정
2. 마크다운 스타일 최적화
3. 에러 처리 개선

### Sprint 2: 추가 기능 및 최적화
1. 네비게이션 화살표 구현
2. 검색 기능 추가
3. 성능 최적화

### Sprint 3: 배포 및 마무리
1. GitHub Pages 설정
2. 최종 테스트
3. 문서화 완성

---

## 👥 팀 정보

**개발자**: Claude AI Assistant + 사용자 협업
**기간**: 2025년 8월 14일 ~
**프로젝트 관리**: 실시간 협업

---

## 📚 참고 자료

- [React 공식 문서](https://react.dev/)
- [Tailwind CSS v4 문서](https://tailwindcss.com/blog/tailwindcss-v4)
- [Vite 공식 문서](https://vitejs.dev/)
- [Framer Motion 문서](https://www.framer.com/motion/)
- [Zustand 문서](https://github.com/pmndrs/zustand)

---

*마지막 업데이트: 2025년 8월 14일*
*다음 업데이트: 마크다운 렌더링 이슈 해결 후*