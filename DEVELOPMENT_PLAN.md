# 이화여대 AI 과정 React 리팩터링 개발계획서

## 📋 프로젝트 개요

**목적**: 기존 정적 사이트를 React + TypeScript + 백엔드 시스템으로 확장하여 사용자 개인화 및 학습 관리 기능 제공

**기간**: 2025년 8월 14일 시작

**현재 상태**: 🟡 진행 중 (백엔드 연동 준비 단계)

**배포 주소**: 
- Frontend: https://modulabs.github.io
- Backend: http://modulabs.ddns.net (구축 예정)

---

## 🎯 요구사항 및 목표

### 핵심 기능 요구사항
- ✅ **LMS 스타일 네비게이션**: 진행률, 현재 위치 표시
- ✅ **부드러운 사이드바**: 애니메이션으로 접기/펼치기
- ✅ **마크다운 렌더링**: 기존 .md 파일들 그대로 활용
- ✅ **반응형 디자인**: 모바일/태블릿 대응
- ✅ **사용자 인증 시스템**: 백엔드 연동으로 개인화 지원
- ✅ **라우트 보호**: 로그인하지 않은 사용자 접근 제한
- 🔄 **콘텐츠 잠금 시스템**: 관리자가 학습 콘텐츠 접근 제어
- 🔄 **학습 진행도 동기화**: 서버 기반 진행 상태 관리
- 🔄 **과제 제출 시스템**: 파일 업로드 및 검토 워크플로우
- 🔄 **실시간 학습 추적**: 상세한 학습 로그 및 분석
- 🔄 **관리자 대시보드**: 전체 학습 현황 모니터링

### 기존 Static Site의 한계점
- 사이드바 접기/펼치기 애니메이션 이슈 (✅ 해결됨)
- 현재 페이지 하이라이팅 부족 (✅ 해결됨)
- 진행 상태 표시 기능 없음 (✅ 로컬스토리지로 해결)
- 반응형 디자인 제한 (✅ 해결됨)
- **사용자 인증 및 개인화 불가** 🔄
- **학습 데이터 서버 동기화 불가** 🔄
- **과제 제출 및 관리 불가** 🔄
- **실시간 학습 분석 불가** 🔄
- **다중 사용자 관리 불가** 🔄

---

## 🛠 기술 스택

### Frontend 핵심
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (새로운 CSS-first 구성)
- **Framer Motion** (애니메이션)
- **React Router v6** (라우팅)
- **Zustand** (클라이언트 상태 관리)
- **Axios/Fetch** (백엔드 API 통신)
- **React Query/TanStack Query** (서버 상태 관리)
- **React Hook Form** (폼 관리)
- **JWT 토큰 관리** (인증)

### 마크다운 처리
- **react-markdown** + **remark-gfm**
- **rehype-highlight** (코드 하이라이팅)

### UI 컴포넌트
- **Lucide React** (아이콘)
- **커스텀 컴포넌트** (재사용 가능한 UI)

### 배포
- **Frontend**: GitHub Pages (modulabs.github.io)
- **Backend**: 직접 서버 운영 (http://modulabs.ddns.net)
- **Database**: PostgreSQL
- **File Storage**: 로컬 서버 또는 S3 호환 스토리지

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

### 5. 사용자 인증 시스템
- ✅ **인증 Store (Zustand)**: 사용자 상태 관리
- ✅ **로그인 페이지**: JWT 기반 인증
- ✅ **회원가입 페이지**: 사용자 등록 기능
- ✅ **JWT 토큰 관리**: localStorage를 통한 토큰 저장
- ✅ **라우트 보호**: ProtectedRoute 컴포넌트로 접근 제어

### 6. 콘텐츠 잠금 시스템 (진행 중)
- ✅ **관리자 권한 체크**: 관리자는 잠금된 콘텐츠 접근 가능
- ✅ **사이드바 잠금 UI**: 잠금 상태 시각적 표시
- ✅ **잠금 제어 UI**: 관리자 대시보드에 콘텐츠 잠금 제어 패널
- ✅ **백엔드 API 구축**: ContentLock API 완전 구현 완료
- 🔄 **CORS 설정 이슈**: Nginx 설정에서 Authorization 헤더 처리 문제
- ⏳ **프론트엔드 연동**: 백엔드 API와 완전 연동 예정

### 7. 과제 제출 시스템 (새로 추가)
- ✅ **AssignmentSubmissionBox 컴포넌트**: 과제 제출 UI 구현
- ✅ **사이드바 통합**: 각 Day별로 과제 제출란 추가
- ✅ **타입 시스템 확장**: SidebarItem에 과제 관련 속성 추가
- ⏳ **백엔드 API 연동**: 과제 제출/조회 API 구현 필요

### 8. 해결된 주요 기술 이슈
- ✅ **Tailwind CSS v4 호환성**: `@import "tailwindcss"` 방식 적용
- ✅ **순환 참조 문제**: SidebarItem의 renderChildren 패턴으로 해결
- ✅ **애니메이션 구현**: Framer Motion으로 부드러운 사이드바
- ✅ **백엔드 연동**: 인증 API와 프론트엔드 연결

---

## 🚧 현재 진행 중

### 1. 콘텐츠 잠금 시스템 CORS 이슈
**문제**: Authorization 헤더가 포함된 요청에서 302 리디렉션 발생
- 로그인 API: 성공 ✅
- 콘텐츠 잠금 API: CORS preflight 실패 ❌

**원인**: Nginx 설정에서 Authorization 헤더 포함된 preflight 요청 처리 문제

**현재 상태**: 백엔드 API는 정상 작동, Nginx 설정 조정 필요

### 2. 과제 제출 시스템 백엔드 API 필요
**구현 완료**: 프론트엔드 UI 및 컴포넌트 구조
**남은 작업**: 백엔드 API 구현 및 연동

---

## 📝 남은 작업

### 1. 콘텐츠 잠금 시스템 완성
- ✅ **백엔드 API 구현**: 완전 구현 완료
- 🔄 **CORS 설정 해결**: Nginx Authorization 헤더 처리 문제 해결
- 🔄 **프론트엔드 API 연동**: contentLockStore를 백엔드와 완전 연결
- 🔄 **실시간 동기화**: 잠금 상태 변경 시 모든 사용자에게 반영

### 2. 과제 제출 시스템 구현
- ✅ **프론트엔드 UI**: AssignmentSubmissionBox 컴포넌트 완성
- ⏳ **백엔드 API**: 과제 제출/조회/수정 API 구현
- ⏳ **파일 업로드**: GitHub/노션/드라이브 링크 검증 시스템
- ⏳ **관리자 검토**: 과제 승인/피드백 시스템

### 3. 마크다운 렌더링 완성
- 🔄 파일 경로 매핑 수정
- ⏳ 마크다운 스타일링 최적화
- ⏳ 코드 하이라이팅 구현

### 4. 추가 기능 구현
- ⏳ 이전/다음 페이지 네비게이션
- ⏳ 검색 기능
- ⏳ 다크 모드 지원

### 5. 성능 최적화
- ⏳ 코드 스플리팅
- ⏳ 이미지 최적화
- ⏳ 번들 사이즈 최적화

### 6. 배포 설정
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
| 컴포넌트 구현 | 98% | 🟡 |
| 상태 관리 | 100% | ✅ |
| 라우팅 | 100% | ✅ |
| 사용자 인증 | 100% | ✅ |
| 콘텐츠 잠금 시스템 | 85% | 🟡 |
| 과제 제출 시스템 | 70% | 🟡 |
| 마크다운 렌더링 | 80% | 🟡 |
| 스타일링 | 90% | 🟡 |
| 배포 준비 | 0% | ⏳ |

**전체 진행률: 약 85%**

---

## 🐛 알려진 이슈

### 1. 콘텐츠 잠금 API CORS 이슈 (진행 중)
- **현상**: Authorization 헤더 포함 요청에서 302 리디렉션 발생
- **원인**: Nginx 설정에서 preflight 요청 처리 문제
- **상태**: 백엔드 API는 정상, Nginx 조정 필요

### 2. 마크다운 파일 로딩 (진행 중)
- **현상**: Day 세션 클릭 시 HTML 소스 표시
- **원인**: 파일 경로 매핑 오류
- **해결책**: 파라미터 파싱 로직 수정

### 3. Tailwind CSS v4 호환성 (해결됨)
- **해결**: `@import "tailwindcss"` 방식으로 변경
- **결과**: 정상 작동

### 4. 순환 참조 문제 (해결됨)
- **해결**: renderChildren 패턴 적용
- **결과**: SidebarItem 정상 렌더링

---

## 🔄 다음 스프린트 계획

### Sprint 1: 콘텐츠 잠금 시스템 완성 (우선순위: 높음)
1. Nginx CORS 설정 수정
2. 프론트엔드-백엔드 완전 연동
3. 실시간 동기화 테스트

### Sprint 2: 과제 제출 시스템 구현 (우선순위: 높음)
1. 백엔드 과제 제출 API 구현
2. 프론트엔드 API 연동
3. 관리자 검토 시스템 구축

### Sprint 3: 마크다운 렌더링 완성 (우선순위: 중간)
1. SessionPage 파일 경로 수정
2. 마크다운 스타일 최적화
3. 에러 처리 개선

### Sprint 4: 추가 기능 및 배포 (우선순위: 낮음)
1. 네비게이션 화살표 구현
2. GitHub Pages 설정
3. 최종 테스트 및 문서화

---

## 🔮 후순위 개발 계획 (Phase 5+)

> 📋 **연관 문서**: [BACKEND.md - Phase 5: 콘텐츠 이관 및 고도화](./BACKEND.md#phase-5-콘텐츠-이관-및-고도화-향후-계획)

### 배경 및 목적
현재 `public/` 폴더에 있는 마크다운 콘텐츠들이 누구나 접근 가능한 상태입니다. 백엔드 시스템 구축 완료 후, 콘텐츠 보안 강화 및 동적 관리를 위한 점진적 이관이 필요합니다.

### Phase 5-1: 콘텐츠 권한 확인 시스템 (1-2주)
**목표**: 기존 파일 구조 유지하면서 권한 기반 접근 제어 추가

#### 프론트엔드 작업
- [ ] **ContentGuard 컴포넌트 구현**
  ```typescript
  // 콘텐츠 로드 전 권한 확인
  const ContentGuard: React.FC<{children: ReactNode, contentPath: string}> 
  ```
- [ ] **MarkdownRenderer 확장**
  - 콘텐츠 로드 전 `GET /api/v1/content/auth-check` API 호출
  - JWT 토큰 기반 권한 검증
  - 권한 없는 경우 잠금 UI 표시
- [ ] **인증 헤더 자동 추가**
  - Axios interceptor에 JWT 토큰 자동 포함
  - 토큰 만료 시 자동 갱신 로직
- [ ] **로딩 및 에러 상태 처리**
  - 권한 확인 중 스켈레톤 UI
  - 접근 거부 시 친화적 메시지

#### 백엔드 연동
- 백엔드 Phase 5-1과 동기화: 메타데이터 관리 API 연동
- 백엔드 Phase 5-2와 동기화: 접근 제어 API 연동

### Phase 5-2: 하이브리드 콘텐츠 서빙 (1주)
**목표**: API를 통한 안전한 콘텐츠 서빙으로 전환

#### 프론트엔드 작업
- [ ] **API 기반 콘텐츠 로더 구현**
  ```typescript
  // 기존: fetch('/day1/01_onboarding.md')
  // 변경: fetch('/api/v1/content/day1/01_onboarding')
  ```
- [ ] **콘텐츠 캐시 전략 구현**
  - React Query를 이용한 콘텐츠 캐싱
  - 권한 변경 시 캐시 무효화
- [ ] **점진적 마이그레이션 지원**
  - 환경변수로 API/Static 모드 전환 가능
  - 개발 환경에서는 기존 방식 유지

#### 백엔드 연동
- 백엔드 Phase 5-3과 동기화: 하이브리드 서빙 시스템

### Phase 5-3: 동적 콘텐츠 관리 UI (2-3주)
**목표**: 관리자가 콘텐츠를 실시간으로 편집할 수 있는 인터페이스

#### 관리자 페이지 확장
- [ ] **콘텐츠 관리 페이지 (`/admin/content`)**
  ```
  ┌─ 📁 콘텐츠 트리 ─┐ ┌─ ✍️ 마크다운 에디터 ─┐
  │ Day 1            │ │ # 제목               │
  │ ├── 01_onboard   │ │ 내용 편집...         │
  │ ├── 02_trends    │ │ [미리보기] [저장]    │
  │ Day 2            │ │                     │
  └─────────────────┘ └─────────────────────┘
  ```
- [ ] **실시간 마크다운 에디터**
  - Monaco Editor 또는 CodeMirror 적용
  - 실시간 미리보기 기능
  - 문법 하이라이팅 및 자동완성
- [ ] **콘텐츠 버전 관리 UI**
  - 변경 히스토리 조회
  - 이전 버전으로 롤백 기능
  - 변경사항 diff 표시
- [ ] **콘텐츠 메타데이터 편집**
  - 제목, 순서, 잠금 조건 수정
  - 태그 및 카테고리 관리

#### 백엔드 연동
- 백엔드 Phase 5-4, 5-5와 동기화: 동적 콘텐츠 관리 API

### Phase 5-4: 개인화 및 고급 기능 (2-3주)
**목표**: 사용자별 맞춤 콘텐츠 및 학습 경험 제공

#### 개인화 기능
- [ ] **사용자별 맞춤 콘텐츠**
  - 진행도 기반 추천 콘텐츠
  - 사용자 역할별 콘텐츠 필터링
  - 학습 스타일 기반 콘텐츠 우선순위
- [ ] **동적 콘텐츠 블록**
  ```typescript
  // 마크다운 내 동적 블록
  // {{user.name}}님, 현재 진행률: {{progress.percentage}}%
  // {{if user.role === 'instructor'}}강사 전용 내용{{/if}}
  ```
- [ ] **실시간 협업 기능**
  - 콘텐츠 댓글 시스템
  - 사용자간 질문/답변
  - 실시간 학습 현황 공유

#### 성능 및 UX 개선
- [ ] **프리로딩 및 캐시 최적화**
  - 다음 콘텐츠 미리 로드
  - Service Worker를 이용한 오프라인 지원
- [ ] **접근성 개선**
  - 스크린 리더 지원
  - 키보드 네비게이션 강화
  - 다크 모드 지원

### Phase 5-5: 분석 및 인사이트 (1-2주)
**목표**: 콘텐츠 사용 패턴 분석 및 개선점 도출

#### 분석 대시보드
- [ ] **콘텐츠 사용 통계**
  - 페이지별 체류 시간
  - 이탈률 분석
  - 인기 콘텐츠 순위
- [ ] **학습 패턴 시각화**
  - 사용자별 학습 경로 추적
  - 난이도별 완료율 차트
  - 시간대별 접속 패턴
- [ ] **콘텐츠 개선 제안**
  - AI 기반 콘텐츠 품질 분석
  - 사용자 피드백 통합
  - 자동 개선 제안 생성

### 기술 스택 확장
```typescript
// 추가 의존성
dependencies: {
  // 에디터
  "@monaco-editor/react": "^4.6.0",
  "react-codemirror": "^3.0.0",
  
  // 실시간 통신
  "socket.io-client": "^4.7.0",
  
  // 차트 및 시각화
  "recharts": "^2.8.0",
  "d3": "^7.8.0",
  
  // 오프라인 지원
  "workbox": "^7.0.0",
  
  // 성능 모니터링
  "@sentry/react": "^7.0.0"
}
```

### 완료 기준
- [ ] 모든 콘텐츠가 권한 기반으로 제어됨
- [ ] 관리자가 실시간으로 콘텐츠 편집 가능
- [ ] 사용자별 개인화된 학습 경험 제공
- [ ] 성능 저하 없이 동적 기능 제공
- [ ] 상세한 학습 분석 데이터 수집

### 우선순위 및 의존성
- **전제 조건**: Backend Phase 1-4 완료 필수
- **우선순위**: 낮음 (기본 LMS 기능 안정화 후 진행)
- **예상 기간**: 총 7-11주 (백엔드와 병렬 진행 가능)

### 관련 문서
- 📋 [BACKEND.md - Phase 5 상세 계획](./BACKEND.md#phase-5-콘텐츠-이관-및-고도화-향후-계획)
- 🎨 [ADMIN_FRONTEND_PLAN.md - 관리자 페이지 설계](./ADMIN_FRONTEND_PLAN.md)

---

## 🔌 콘텐츠 잠금 시스템 API 설계

### 📋 개요
관리자가 설정한 콘텐츠 잠금 상태를 모든 사용자에게 실시간으로 동기화하기 위한 API 시스템입니다.

### 🏗 데이터베이스 설계

#### content_locks 테이블
```sql
CREATE TABLE content_locks (
    id SERIAL PRIMARY KEY,
    content_id VARCHAR(50) UNIQUE NOT NULL,  -- 'day1', 'day2', 'day3' 등
    is_locked BOOLEAN NOT NULL DEFAULT true,
    locked_at TIMESTAMP WITH TIME ZONE,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),    -- 잠금 설정한 관리자
    updated_by UUID REFERENCES users(id),    -- 마지막 수정한 관리자
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_content_locks_content_id ON content_locks(content_id);
CREATE INDEX idx_content_locks_is_locked ON content_locks(is_locked);
```

### 🔗 API 엔드포인트

#### 1. 전체 잠금 상태 조회
```http
GET /api/v1/content/locks
Authorization: Bearer {access_token}
```

**응답 데이터:**
```typescript
interface ContentLockResponse {
  success: boolean;
  data: {
    locks: ContentLock[];
    last_updated: string;
  };
  message: string;
  timestamp: string;
}

interface ContentLock {
  content_id: string;      // 'day1', 'day2', 'day3'
  is_locked: boolean;
  locked_at?: string;      // ISO 8601
  unlocked_at?: string;    // ISO 8601
  created_by: {
    id: string;
    name: string;
  };
  updated_by: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "locks": [
      {
        "content_id": "day1",
        "is_locked": false,
        "unlocked_at": "2025-08-18T09:00:00Z",
        "created_by": {
          "id": "admin-uuid",
          "name": "관리자"
        },
        "updated_by": {
          "id": "admin-uuid", 
          "name": "관리자"
        },
        "created_at": "2025-08-18T08:00:00Z",
        "updated_at": "2025-08-18T09:00:00Z"
      },
      {
        "content_id": "day2",
        "is_locked": true,
        "locked_at": "2025-08-18T08:00:00Z",
        "created_by": {
          "id": "admin-uuid",
          "name": "관리자"
        },
        "updated_by": {
          "id": "admin-uuid",
          "name": "관리자"
        },
        "created_at": "2025-08-18T08:00:00Z",
        "updated_at": "2025-08-18T08:00:00Z"
      }
    ],
    "last_updated": "2025-08-18T09:00:00Z"
  },
  "message": "잠금 상태 조회 성공",
  "timestamp": "2025-08-18T10:30:00Z"
}
```

#### 2. 개별 콘텐츠 잠금 상태 변경 (관리자 전용)
```http
PUT /api/v1/content/locks/{content_id}
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 데이터:**
```typescript
interface UpdateContentLockRequest {
  is_locked: boolean;
  reason?: string;  // 변경 사유 (선택사항)
}
```

**요청 예시:**
```json
{
  "is_locked": false,
  "reason": "Day 2 강의 시작으로 인한 잠금 해제"
}
```

**응답 데이터:**
```json
{
  "success": true,
  "data": {
    "content_id": "day2",
    "is_locked": false,
    "unlocked_at": "2025-08-18T10:30:00Z",
    "updated_by": {
      "id": "admin-uuid",
      "name": "관리자"
    },
    "updated_at": "2025-08-18T10:30:00Z"
  },
  "message": "day2 잠금이 해제되었습니다",
  "timestamp": "2025-08-18T10:30:00Z"
}
```

#### 3. 다중 콘텐츠 잠금 상태 일괄 변경 (관리자 전용)
```http
PUT /api/v1/content/locks/batch
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 데이터:**
```typescript
interface BatchUpdateContentLockRequest {
  updates: Array<{
    content_id: string;
    is_locked: boolean;
  }>;
  reason?: string;
}
```

**요청 예시:**
```json
{
  "updates": [
    {
      "content_id": "day2",
      "is_locked": false
    },
    {
      "content_id": "day3", 
      "is_locked": false
    }
  ],
  "reason": "전체 콘텐츠 해제"
}
```

#### 4. 잠금 설정 히스토리 조회 (관리자 전용)
```http
GET /api/v1/content/locks/{content_id}/history
Authorization: Bearer {access_token}
```

**응답 데이터:**
```typescript
interface ContentLockHistory {
  content_id: string;
  action: 'locked' | 'unlocked';
  performed_by: {
    id: string;
    name: string;
    email: string;
  };
  reason?: string;
  timestamp: string;
}
```

### 🔄 프론트엔드 연동 방안

#### 1. ContentLockStore 수정
```typescript
// src/store/contentLockStore.ts
interface ContentLockState {
  locks: Record<string, boolean>;
  isLoading: boolean;
  lastUpdated?: string;
  
  // API 메서드들
  fetchLocks: () => Promise<void>;
  updateLock: (contentId: string, locked: boolean) => Promise<void>;
  batchUpdateLocks: (updates: Array<{contentId: string, locked: boolean}>) => Promise<void>;
  isItemLocked: (contentId: string) => boolean;
}
```

#### 2. API 서비스 함수
```typescript
// src/services/contentLockApi.ts
const API_BASE_URL = 'https://modulabs.ddns.net/ewha/api/v1';

export const contentLockApi = {
  // 전체 잠금 상태 조회
  getLocks: async (): Promise<ContentLockResponse> => {
    const response = await fetch(`${API_BASE_URL}/content/locks`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // 개별 잠금 상태 변경
  updateLock: async (contentId: string, isLocked: boolean, reason?: string) => {
    const response = await fetch(`${API_BASE_URL}/content/locks/${contentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_locked: isLocked, reason })
    });
    return response.json();
  },

  // 일괄 변경
  batchUpdate: async (updates: Array<{content_id: string, is_locked: boolean}>, reason?: string) => {
    const response = await fetch(`${API_BASE_URL}/content/locks/batch`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ updates, reason })
    });
    return response.json();
  }
};
```

#### 3. 실시간 동기화 (Polling 방식)
```typescript
// useContentLockSync.ts - 커스텀 훅
export const useContentLockSync = () => {
  const { fetchLocks, lastUpdated } = useContentLockStore();
  
  useEffect(() => {
    // 30초마다 잠금 상태 확인
    const interval = setInterval(() => {
      fetchLocks();
    }, 30000);
    
    // 컴포넌트 마운트 시 즉시 조회
    fetchLocks();
    
    return () => clearInterval(interval);
  }, [fetchLocks]);
};
```

### 🔒 권한 관리
- **일반 사용자**: 잠금 상태 조회만 가능
- **관리자**: 모든 잠금 상태 조회 및 변경 가능
- **JWT 토큰**: 모든 API 호출 시 필수

### 🚀 구현 우선순위
1. **높음**: 기본 잠금 상태 조회/변경 API
2. **중간**: 일괄 변경 API
3. **낮음**: 히스토리 조회 API

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

*마지막 업데이트: 2025년 8월 18일*
*다음 업데이트: CORS 이슈 해결 및 과제 제출 시스템 완성 후*

## 📈 최근 업데이트 (2025.08.18)

### 새로 추가된 기능
- **과제 제출 시스템**: AssignmentSubmissionBox 컴포넌트 구현
- **사이드바 통합**: 각 Day별 과제 제출란 추가
- **타입 시스템 확장**: 과제 관련 속성 추가

### 진행 중인 이슈
- **콘텐츠 잠금 API**: 백엔드 완성, CORS 설정 조정 필요
- **과제 제출**: 프론트엔드 완성, 백엔드 API 구현 필요