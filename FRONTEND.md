# 프론트엔드 기능 및 아키텍처 문서

> 이화여자대학교 AI 에이전트 개발 과정 - React 기반 교육용 웹 애플리케이션

## 📚 목차
1. [기술 스택](#기술-스택)
2. [아키텍처 개요](#아키텍처-개요)
3. [주요 컴포넌트](#주요-컴포넌트)
4. [핵심 기능](#핵심-기능)
5. [상태 관리](#상태-관리)
6. [UI/UX 특징](#uiux-특징)
7. [성능 최적화](#성능-최적화)

---

## 🛠 기술 스택

### Core Framework
- **React 19.1.1** - 최신 React 기반 SPA
- **TypeScript** - 타입 안전성 보장
- **Vite** - 빠른 개발 서버 및 빌드 도구

### 스타일링 & UI
- **Tailwind CSS 4.x** - 유틸리티 퍼스트 CSS 프레임워크
- **@tailwindcss/typography** - 마크다운 콘텐츠 스타일링
- **Lucide React** - 아이콘 라이브러리
- **Framer Motion** - 부드러운 애니메이션

### 라우팅 & 상태관리
- **React Router DOM 7.x** - 클라이언트 사이드 라우팅
- **Zustand** - 간단하고 효율적인 상태 관리

### 마크다운 & 콘텐츠
- **React Markdown** - 마크다운 렌더링
- **remark-gfm** - GitHub Flavored Markdown 지원
- **rehype-raw** - HTML 태그 지원
- **React Syntax Highlighter** - 코드 블럭 하이라이팅

---

## 🏗 아키텍처 개요

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── Layout/         # 전체 레이아웃 구조
│   ├── Sidebar/        # 네비게이션 사이드바
│   ├── MarkdownRenderer/ # 마크다운 콘텐츠 렌더링
│   ├── CodeBlock/      # 코드 블럭 컴포넌트
│   └── ContentDetailModal/ # 상세 내용 모달
├── pages/              # 페이지 컴포넌트
├── store/              # Zustand 상태 관리
├── data/              # 정적 데이터 (사이드바 구조 등)
├── types/             # TypeScript 타입 정의
└── App.tsx            # 앱 진입점
```

### 컴포넌트 아키텍처 특징
- **컨테이너-프레젠테이션 패턴**: 로직과 UI 분리
- **컴포넌트 합성**: 재사용 가능한 작은 컴포넌트들 조합
- **Props Drilling 최소화**: Zustand로 전역 상태 관리

---

## 🧩 주요 컴포넌트

### 1. Layout (`src/components/Layout/Layout.tsx`)
- **역할**: 전체 앱 레이아웃 구조 제공
- **주요 기능**:
  - 사이드바와 메인 컨텐츠 영역 분리
  - 반응형 레이아웃 (모바일/데스크톱)
  - 사이드바 상태에 따른 메인 영역 크기 조정

```typescript
// 핵심 구조
<div className="h-screen bg-gray-50">
  <Sidebar onNavigate={onNavigate} />
  <main className={`transition-all ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'}`}>
    {children}
  </main>
</div>
```

### 2. Sidebar (`src/components/Sidebar/`)
- **Sidebar.tsx**: 메인 사이드바 컨테이너
- **SidebarItem.tsx**: 개별 네비게이션 아이템

**주요 기능**:
- 접을 수 있는 네비게이션 구조
- 진행 상황 체크 기능
- 잠금 시스템 (Day 2, 3 비활성화)
- 프레이머 모션 애니메이션
- 모바일 반응형 슬라이딩

```typescript
// 핵심 상태 관리
const { sidebarOpen, toggleSidebar, currentPath, expandedItems } = useNavigationStore();
```

### 3. MarkdownRenderer (`src/components/MarkdownRenderer/MarkdownRenderer.tsx`)
- **역할**: 마크다운 파일을 React 컴포넌트로 렌더링
- **고급 기능**:
  - HTML 태그 지원 (rehype-raw)
  - GitHub Flavored Markdown (remark-gfm)
  - 커스텀 `<details>` 태그를 모달로 변환
  - 외부 링크 새 창 열기
  - **마크다운 영역만 선택 기능** (Ctrl+A)

```typescript
// 마크다운 영역만 선택하는 핵심 기능
const handleKeyDown = (e: React.KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.preventDefault();
    e.stopPropagation();
    
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(e.currentTarget);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};
```

### 4. CodeBlock (`src/components/CodeBlock/CodeBlock.tsx`)
- **역할**: 코드 블럭 렌더링 및 상호작용
- **주요 기능**:
  - Prism.js 기반 신택스 하이라이팅
  - 원클릭 코드 복사 기능
  - 커스텀 다크 테마
  - 호버 시 복사 버튼 표시

### 5. ContentDetailModal (`src/components/ContentDetailModal/ContentDetailModal.tsx`)
- **역할**: 상세 내용을 모달로 표시
- **애니메이션 특징**:
  - 페이드인/아웃 + 스케일 + 위치 이동
  - 부드러운 전환 효과 (200ms)
  - 오버레이 클릭으로 닫기
  - ESC 키 지원 (브라우저 기본)

---

## ⚡ 핵심 기능

### 1. 반응형 네비게이션 시스템
- **데스크톱**: 고정 사이드바 (280px)
- **모바일**: 슬라이딩 오버레이 사이드바
- **상태 기반**: Zustand로 열림/닫힘 상태 관리
- **지속성**: localStorage에 상태 저장

### 2. 학습 진행도 관리
- **완료 체크**: 각 세션별 완료 상태 토글
- **시각적 피드백**: 완료된 항목 다른 색상 표시
- **지속성**: 브라우저 새로고침 후에도 상태 유지

### 3. 콘텐츠 잠금 시스템
```typescript
// sidebarData.ts에서 설정
{
  id: 'day2',
  title: 'Day 2 (8/20 수)',
  locked: true, // 이 속성으로 잠금 제어
  children: [...]
}
```
- Day 2, 3 콘텐츠 접근 제한
- 시각적 잠금 아이콘 표시
- 클릭 비활성화

### 4. 마크다운 고급 처리
- **HTML 태그 지원**: div, details, summary 등
- **커스텀 변환**: `<details>` → 클릭 가능한 카드 → 모달
- **외부 링크**: 자동으로 `target="_blank"` 추가
- **코드 블럭**: 언어별 신택스 하이라이팅

### 5. 사용자 경험 최적화
- **Lazy Loading**: React.lazy로 페이지 코드 스플리팅
- **로딩 상태**: Suspense 활용한 로딩 화면
- **에러 처리**: 404 페이지 및 마크다운 로딩 실패 처리
- **키보드 단축키**: Ctrl+A로 마크다운 영역만 선택

---

## 🗄 상태 관리

### Zustand Store (`src/store/navigationStore.ts`)

```typescript
interface NavigationState {
  currentPath: string;        // 현재 선택된 경로
  expandedItems: string[];    // 펼쳐진 사이드바 항목들
  completedItems: string[];   // 완료된 항목들
  sidebarOpen: boolean;       // 사이드바 열림/닫힘 상태
  
  // Actions
  setCurrentPath: (path: string) => void;
  toggleExpanded: (itemId: string) => void;
  toggleCompleted: (itemId: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}
```

**지속성 설정**:
```typescript
// localStorage에 일부 상태만 저장
partialize: (state) => ({ 
  expandedItems: state.expandedItems,
  completedItems: state.completedItems,
  sidebarOpen: state.sidebarOpen 
})
```

---

## 🎨 UI/UX 특징

### 디자인 시스템
- **컬러 팔레트**: Tailwind 기본 + 커스텀 블루/그레이
- **타이포그래피**: 시스템 폰트 스택
- **간격**: Tailwind 스페이싱 시스템 (4px 단위)
- **그림자**: 계층화된 elevation 시스템

### 애니메이션 전략
1. **마이크로 인터랙션**: 버튼 호버, 포커스 상태
2. **페이지 전환**: 부드러운 사이드바 슬라이딩
3. **콘텐츠 전환**: 모달 페이드인/아웃
4. **리스트 확장**: Framer Motion 높이 애니메이션

### 반응형 브레이크포인트
```css
/* Tailwind 기본 브레이크포인트 활용 */
sm: 640px   /* 모바일 가로 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 큰 데스크톱 */
```

---

## 🚀 성능 최적화

### 1. 코드 스플리팅
```typescript
// App.tsx에서 지연 로딩
const HomePage = React.lazy(() => import('./pages/HomePage'));
const SessionPage = React.lazy(() => import('./pages/SessionPage'));
```

### 2. 번들 최적화
- **Tree Shaking**: ES6 모듈 기반 불필요한 코드 제거
- **Dynamic Import**: 사용하지 않는 페이지는 필요시에만 로드
- **CSS 최적화**: Tailwind CSS purging으로 사용되지 않는 스타일 제거

### 3. 사용자 경험 개선
- **Suspense**: 컴포넌트 로딩 중 fallback UI 제공
- **Error Boundary**: 에러 발생 시 graceful fallback
- **로컬 스토리지**: 사용자 설정 지속성

### 4. 이미지 최적화
- **Lazy Loading**: iframe 컨텐츠 지연 로딩
- **WebP/AVIF**: 최신 이미지 포맷 지원 준비

---

## 📱 반응형 디자인

### 모바일 우선 접근법
1. **Navigation**: 모바일에서 오버레이 사이드바
2. **Content**: 작은 화면에서 패딩 조정
3. **Modal**: 모바일에서 전체 화면에 가깝게 확장
4. **Typography**: 화면 크기별 텍스트 크기 조정

### 터치 친화적 인터랙션
- **최소 터치 영역**: 44x44px 이상
- **스크롤**: 부드러운 스크롤링 경험
- **제스처**: 스와이프로 사이드바 열기 (향후 계획)

---

## 🔧 개발 도구 & 설정

### 개발 환경
- **Vite Dev Server**: HMR 지원 빠른 개발
- **TypeScript**: 엄격한 타입 검사
- **ESLint**: 코드 품질 관리
- **Prettier**: 일관된 코드 포매팅 (권장)

### 빌드 & 배포
- **GitHub Pages**: 자동 배포 설정
- **Hash Router**: GitHub Pages 호환성
- **Base URL**: 서브 경로 지원

---

## 🎯 향후 개선 계획

### 단기 목표
1. **PWA 지원**: Service Worker 추가
2. **다크 모드**: 테마 토글 시스템
3. **검색 기능**: 콘텐츠 전체 검색
4. **북마크**: 중요한 섹션 즐겨찾기

### 중장기 목표
1. **오프라인 지원**: 캐싱 전략 구현
2. **다국어 지원**: i18n 시스템 도입
3. **학습 분석**: 진행도 및 시간 추적
4. **소셜 기능**: 학습 내용 공유

---

## 📋 구현 체크리스트

### ✅ 완료된 기능
- [x] React + TypeScript 기본 구조
- [x] 반응형 사이드바 네비게이션
- [x] 마크다운 렌더링 시스템
- [x] 코드 블럭 하이라이팅
- [x] 진행도 체크 시스템
- [x] 콘텐츠 잠금 시스템
- [x] 모달 시스템
- [x] 상태 지속성 (localStorage)
- [x] GitHub Pages 배포
- [x] 마크다운 영역만 선택 기능

### 🔄 개선 중인 기능
- [ ] 접근성 개선 (ARIA 레이블)
- [ ] 성능 모니터링
- [ ] 테스트 코드 작성

### 🆕 최근 추가된 기능 (2025.08.18)
- [x] **과제 제출 시스템**: 백엔드 API와 완전 연동
  - AssignmentSubmissionBox 컴포넌트를 실제 API와 연결
  - 과제 템플릿 조회, 제출, 피드백 확인 기능
  - 사이드바에 통합된 과제 제출 UI
- [x] **관리자 대시보드**: 실제 데이터로 동작
  - 과제 템플릿 생성 및 관리
  - 제출물 목록 조회 및 검토
  - 리뷰 및 피드백 시스템
- [x] **CSV 사용자 관리**: 대량 사용자 등록
  - 드래그 앤 드롭 파일 업로드
  - 업로드 결과 상세 표시
  - 템플릿 다운로드 기능
- [x] **API 서비스 레이어**: 체계적인 백엔드 연동
  - assignmentApi.ts: 과제 관련 API
  - userApi.ts: 사용자 관리 API
  - 토큰 자동 갱신 및 에러 처리

### 📝 추가 예정 기능
- [ ] 검색 기능
- [ ] 다크 모드
- [ ] PWA 지원
- [ ] 오프라인 캐싱
- [ ] 실시간 알림 시스템
- [ ] 파일 업로드 진행률 표시

---

## 🔗 백엔드 연동 현황

### 완료된 API 연동
- ✅ **사용자 인증**: 로그인, 회원가입, 토큰 갱신
- ✅ **콘텐츠 잠금**: 관리자 권한 기반 콘텐츠 접근 제어
- ✅ **과제 시스템**: 템플릿 생성, 제출, 검토 전체 워크플로우
- ✅ **사용자 관리**: CSV 업로드, 목록 조회, 통계

### API 엔드포인트
```typescript
// 과제 관련
GET    /api/v1/daily-assignments/templates
POST   /api/v1/daily-assignments/templates
POST   /api/v1/daily-assignments/submit
GET    /api/v1/daily-assignments/my-submissions
GET    /api/v1/daily-assignments/submissions
POST   /api/v1/daily-assignments/submissions/{id}/review

// 사용자 관리
GET    /api/v1/admin/users
GET    /api/v1/admin/users/stats
POST   /api/v1/admin/users/bulk-create
PUT    /api/v1/admin/users/{id}
DELETE /api/v1/admin/users/{id}

// 콘텐츠 잠금
GET    /api/v1/content/locks
PUT    /api/v1/content/locks/{content_id}
```

---

*이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*
*마지막 업데이트: 2025년 8월 18일*