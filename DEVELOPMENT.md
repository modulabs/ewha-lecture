# 개발 가이드

이 문서는 프로젝트에 기여하거나 수정하려는 개발자들을 위한 상세한 가이드입니다.

## 📋 개발 환경 설정

### 필수 요구사항
- Node.js 20.19.0+ 또는 22.12.0+
- npm 또는 yarn
- Git

### 프로젝트 클론 및 설정
```bash
git clone <repository-url>
cd ewha-react
npm install
npm run dev
```

## 🏗 아키텍처 개요

### 컴포넌트 아키텍처
```
App.tsx (Router, Suspense)
├── Layout.tsx (전체 레이아웃)
│   ├── Sidebar.tsx (사이드바 컨테이너)
│   │   └── SidebarItem.tsx (재귀적 메뉴 아이템)
│   └── Pages (Lazy Loaded)
│       ├── HomePage.tsx
│       └── SessionPage.tsx
│           └── MarkdownRenderer.tsx
```

### 상태 관리 구조
- **Zustand Store**: 전역 상태 관리
  - `navigationStore.ts`: 사이드바 상태, 진행 상태, 현재 경로
  - **LocalStorage 연동**: 상태 영속화

### 라우팅 구조
- **Base Path**: `/ewha-lecture/` (GitHub Pages용)
- **URL 패턴**: 
  - `/` → HomePage
  - `/day1/01_onboarding` → SessionPage
  - 마크다운 파일명과 URL 일치

## 🧩 주요 컴포넌트 분석

### 1. Sidebar 컴포넌트
```typescript
// 주요 기능
- 애니메이션 효과 (Framer Motion)
- 반응형 디자인 (mobile overlay)
- 상태 관리 (Zustand)
- 재귀적 메뉴 구조

// 핵심 코드
<motion.aside animate={{ x: sidebarOpen ? 0 : '-100%' }}>
  {sidebarData.map(item => 
    <SidebarItem key={item.id} item={item} />
  )}
</motion.aside>
```

### 2. MarkdownRenderer 컴포넌트
```typescript
// 주요 기능
- 동적 마크다운 로딩 (fetch API)
- React Markdown 렌더링
- 커스텀 컴포넌트 매핑
- 로딩/에러 상태 처리

// 핵심 코드
const response = await fetch(filePath);
const text = await response.text();
<ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
  {text}
</ReactMarkdown>
```

### 3. 상태 관리 (Zustand)
```typescript
// navigationStore.ts 구조
interface NavigationState {
  currentPath: string;
  expandedItems: string[];
  completedItems: string[];
  sidebarOpen: boolean;
  
  // Actions
  setCurrentPath: (path: string) => void;
  toggleExpanded: (itemId: string) => void;
  toggleCompleted: (itemId: string) => void;
  toggleSidebar: () => void;
}
```

## 🎨 스타일링 가이드

### Tailwind CSS v4 사용법
```css
/* src/index.css */
@import "tailwindcss";

/* 커스텀 스타일 */
.markdown-content h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: rgb(17 24 39);
}
```

### 애니메이션 가이드 (Framer Motion)
```typescript
// 기본 애니메이션 패턴
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
>
  {content}
</motion.div>
```

## 📝 개발 워크플로우

### 1. 새로운 기능 개발
```bash
# 1. 새 브랜치 생성
git checkout -b feature/new-feature

# 2. 개발 및 테스트
npm run dev

# 3. 빌드 테스트
npm run build

# 4. 커밋 및 푸시
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### 2. 마크다운 콘텐츠 추가
```bash
# 1. public 폴더에 마크다운 파일 추가
public/day4/01_new_session.md

# 2. sidebarData.ts 업데이트
src/data/sidebarData.ts

# 3. 라우트 확인 (자동으로 처리됨)
/day4/01_new_session
```

### 3. 컴포넌트 추가
```bash
# 1. 컴포넌트 파일 생성
src/components/NewComponent/
├── NewComponent.tsx
└── index.ts

# 2. 타입 정의 (필요시)
src/types/index.ts

# 3. 테스트 및 통합
```

## 🧪 테스팅 가이드

### 개발 중 확인사항
- [ ] 사이드바 애니메이션 동작
- [ ] 마크다운 렌더링 확인
- [ ] 라우팅 정상 작동
- [ ] 반응형 디자인 확인
- [ ] 상태 저장/복원 확인

### 빌드 검증
```bash
# 1. 프로덕션 빌드
npm run build

# 2. 번들 크기 확인
# dist/ 폴더 크기 및 gzip 압축률 확인

# 3. 미리보기 테스트
npm run preview
```

## 🔧 성능 최적화 가이드

### 1. 코드 분할 규칙
```typescript
// 페이지 컴포넌트는 lazy loading
const HomePage = React.lazy(() => 
  import('./pages/HomePage').then(module => ({ 
    default: module.HomePage 
  }))
);

// 라이브러리는 manual chunks로 분리
// vite.config.ts에서 설정
```

### 2. 번들 분석
```bash
# 번들 크기 분석
npm run build

# 경고 메시지 확인
# 500kB 이상 청크는 추가 분할 고려
```

### 3. 메모리 관리
- **Zustand**: 필요한 상태만 구독
- **React Markdown**: 큰 문서는 가상화 고려
- **이미지**: 지연 로딩 및 최적화

## 🐛 디버깅 가이드

### 자주 발생하는 이슈들

#### 1. 마크다운 파일 로딩 실패
```typescript
// 문제: 파일 경로 문제
// 해결: 절대 경로 사용
const filePath = `/day${day}/${session}.md`;

// Base path 고려 (배포 환경)
const basePath = import.meta.env.BASE_URL;
const filePath = `${basePath}day${day}/${session}.md`;
```

#### 2. 애니메이션 성능 이슈
```typescript
// 문제: 애니메이션 끊김
// 해결: will-change CSS 속성 활용
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: sidebarOpen ? 0 : '-100%' }}
/>
```

#### 3. 상태 동기화 이슈
```typescript
// 문제: 페이지 새로고침 시 상태 손실
// 해결: Zustand persist 설정 확인
persist(
  (set, get) => ({ /* state */ }),
  {
    name: 'ewha-navigation-storage',
    partialize: (state) => ({ 
      expandedItems: state.expandedItems,
      completedItems: state.completedItems 
    }),
  }
)
```

## 📦 빌드 및 배포

### 로컬 빌드
```bash
npm run build
npm run preview  # 로컬에서 프로덕션 빌드 확인
```

### GitHub Pages 배포 준비
```bash
# 1. 빌드
npm run build

# 2. dist 폴더 확인
ls -la dist/

# 3. base path 설정 확인
# vite.config.ts의 base: '/ewha-lecture/'
# App.tsx의 basename="/ewha-lecture"
```

## 🔄 업데이트 가이드

### 의존성 업데이트
```bash
# 보안 업데이트 확인
npm audit

# 의존성 업데이트
npm update

# 주요 버전 업그레이드 (주의)
npm install react@latest
```

### Tailwind CSS 업데이트
```bash
# v4 최신 버전 확인
npm install @tailwindcss/vite@latest

# 설정 파일 확인
# tailwind.config.js 및 vite.config.ts
```

## 📚 참고 자료

### 공식 문서
- [React 18 문서](https://react.dev/)
- [Vite 가이드](https://vitejs.dev/guide/)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand-demo.pmnd.rs/)

### 프로젝트 관련
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- [Remark GFM](https://github.com/remarkjs/remark-gfm)

---

이 가이드가 도움이 되지 않거나 추가 질문이 있으시면 이슈를 생성해 주세요.