# 관리자 페이지 설계 계획서

> 이화여자대학교 AI 에이전트 개발 과정 - 관리자 페이지 UI/UX 설계

## 📋 목차
1. [현재 프론트엔드 분석](#현재-프론트엔드-분석)
2. [관리자 페이지 요구사항](#관리자-페이지-요구사항)
3. [설계 철학 및 원칙](#설계-철학-및-원칙)
4. [페이지 구조 설계](#페이지-구조-설계)
5. [UI 컴포넌트 설계](#ui-컴포넌트-설계)
6. [네비게이션 설계](#네비게이션-설계)
7. [구현 로드맵](#구현-로드맵)

---

## 🔍 현재 프론트엔드 분석

### 디자인 시스템
```
색상 체계:
- 배경: bg-gray-50 (전체), bg-white (카드)
- 텍스트: text-gray-900 (제목), text-gray-600 (본문)
- 경계: border-gray-200
- 그림자: shadow-sm

레이아웃 패턴:
- 사이드바: 280px 고정, 반응형 토글
- 메인: max-w-6xl mx-auto p-4-6
- 카드: rounded-lg shadow-sm p-6
- 간격: space-y-6

컴포넌트 스타일:
- 버튼: hover:bg-gray-100, p-1 rounded
- 제목: text-3xl font-bold (h1), text-2xl font-bold (h2)
- 아이콘: Lucide React (X, Menu 등)
```

### 현재 네비게이션 구조
```
- Home
- Day 1 (8/19 화)
  ├── 1. 온보딩 및 퍼실리테이션
  ├── 2. AI 에이전트 트렌드
  ├── 3. 바이브 코딩과 AI 에이전트
  └── ...
- Day 2, Day 3...
```

---

## 🎯 관리자 페이지 요구사항

### 핵심 기능
1. **학생 관리**: CSV 업로드, 명단 조회, 상태 변경
2. **과제 관리**: 제출 현황, 검토 및 점수 부여
3. **대시보드**: 전체 현황 모니터링
4. **분석**: 학습 진행도, 통계
5. **시스템 관리**: 설정, 로그 조회

### 사용자 시나리오
1. **일일 관리 워크플로우**:
   - 새로운 과제 제출 확인
   - 과제 검토 및 피드백 작성
   - 학생 진행도 모니터링

2. **기수 시작 워크플로우**:
   - 학생 명단 CSV 업로드
   - 허용된 학생 확인
   - 초기 설정

3. **분석 및 리포팅**:
   - 학습 현황 대시보드 확인
   - 문제 학생 식별
   - 통계 리포트 생성

---

## 🎨 설계 철학 및 원칙

### 일관성 유지
- **기존 디자인 시스템 100% 활용**
- 학생용과 동일한 레이아웃 구조
- 색상, 타이포그래피, 컴포넌트 스타일 통일

### 관리자 전용 차별화
- **아이콘과 색상으로 구분**: 관리자 전용 영역은 amber/orange 계열
- **추가 정보 표시**: 상태 배지, 통계 카드, 진행률 바
- **액션 버튼 강화**: 검토, 승인, 거부 등 관리 액션

### 효율성 중심
- **한 화면에 최대한 많은 정보**
- **빠른 액션**: 일괄 처리, 키보드 단축키
- **필터링과 검색**: 대량 데이터 빠른 탐색

---

## 📱 페이지 구조 설계

### 1. 관리자 대시보드 (`/admin`)
```
┌─ 📊 전체 현황 요약 카드 ─┐
│ 학생 수 | 제출률 | 평균점수 │
└─────────────────────────┘

┌─ 📈 실시간 활동 ─┐ ┌─ ⏰ 급한 작업 ─┐
│ • 새 과제 제출    │ │ • 검토 대기 25건  │
│ • 신규 가입 3명   │ │ • 마감 임박 과제  │
│ • 질문 등록      │ │ • 문제 학생 알림  │
└─────────────────┘ └─────────────────┘

┌───── 📋 최근 제출 과제 목록 ─────┐
│ 학생명 | 과제명 | 제출시간 | 상태 │
│ [검토] [다운로드] [메시지] 버튼  │
└─────────────────────────────────┘
```

### 2. 학생 관리 (`/admin/students`)
```
┌─ 🔍 검색 및 필터 ─┐ ┌─ 📤 CSV 업로드 ─┐
│ 기수 | 상태 | 검색   │ │ 파일선택 | 업로드  │
└─────────────────┘ └─────────────────┘

┌───────── 👥 학생 명단 테이블 ─────────┐
│ 이름 | 이메일 | 학번 | 상태 | 가입일 │
│ [상태변경] [메모] [진행도보기] 버튼     │
└─────────────────────────────────────┘

┌─ 📈 통계 요약 ─┐
│ 총원 | 가입 | 대기 │
└─────────────┘
```

### 3. 과제 관리 (`/admin/assignments`)
```
┌─ 📋 과제별 제출 현황 ─┐
│ Day 1 과제 (25/30)    │
│ Day 2 과제 (18/30)    │
└─────────────────────┘

┌─ 선택된 과제: "Day 1 최종 과제" ─┐
│ 📊 제출률: 83% (25/30)         │
│ ⏰ 마감: 2일 전                │
└───────────────────────────────┘

┌────── 📝 제출물 목록 ──────┐
│ 학생명 | 파일 | 제출시간     │
│ [다운로드] [검토] [점수입력]  │
└─────────────────────────┘

┌─ 📋 미제출 학생 ─┐
│ • 박학생          │
│ • 이학생          │
│ [알림발송] 버튼    │
└─────────────────┘
```

### 4. 과제 검토 (`/admin/assignments/{id}/review`)
```
┌─ 📄 제출 정보 ─┐
│ 학생: 김이화     │ 
│ 파일: report.pdf │
│ 제출: 1시간 전   │
└─────────────────┘

┌────── 📑 파일 뷰어 ──────┐
│ PDF/DOC 파일 미리보기     │
│ [다운로드] [새창에서열기]  │
└─────────────────────────┘

┌─ ✍️ 검토 및 점수 ─┐
│ 점수: [85] /100    │
│ 상태: [승인]       │
│ 피드백:           │
│ [텍스트박스]       │
│ [저장] [다음과제]   │
└─────────────────┘
```

### 5. 분석 및 리포트 (`/admin/analytics`)
```
┌─ 📊 학습 진행도 차트 ─┐
│ Day별 완료율 그래프    │
│ 학생별 진행률 히트맵   │
└─────────────────────┘

┌─ 📈 과제 성적 분포 ─┐ ┌─ ⚠️ 주의 학생 ─┐
│ 평균: 82점         │ │ • 진행률 < 30%  │
│ 히스토그램 차트     │ │ • 과제 미제출   │
└─────────────────┘ └─────────────────┘

┌──── 📋 상세 리포트 ────┐
│ [Excel 다운로드]       │
│ [PDF 리포트 생성]      │
└─────────────────────┘
```

---

## 🧩 UI 컴포넌트 설계

### 관리자 전용 컴포넌트

#### 1. AdminStatsCard (통계 카드)
```typescript
interface AdminStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'red';
  trend?: { value: number; isPositive: boolean };
}

// 스타일: 기존 white card + colored accent border
```

#### 2. StatusBadge (상태 배지)
```typescript
interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'registered' | 'blocked';
  size?: 'sm' | 'md';
}

// 색상: pending(gray), approved(green), rejected(red), etc.
```

#### 3. AdminTable (관리자 테이블)
```typescript
interface AdminTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  pagination?: PaginationProps;
  filters?: FilterProps;
  selectable?: boolean;
}

// 기존 스타일 + hover effects + action buttons
```

#### 4. FileUploadZone (CSV 업로드)
```typescript
interface FileUploadZoneProps {
  accept: string;
  onFileSelect: (file: File) => void;
  loading?: boolean;
  maxSize?: number;
}

// Drag & Drop + 진행률 표시
```

#### 5. AssignmentReviewPanel (과제 검토 패널)
```typescript
interface AssignmentReviewPanelProps {
  submission: Submission;
  onReview: (review: ReviewData) => void;
  onNext?: () => void;
}

// 파일 뷰어 + 점수 입력 + 피드백
```

### 재사용 컴포넌트 확장

#### SearchAndFilter
```typescript
// 기존 Layout 패턴 확장
interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  filters: FilterOption[];
  onFilterChange: (filters: FilterState) => void;
}
```

#### ActionButton
```typescript
// 기존 버튼 스타일 확장
interface ActionButtonProps {
  variant: 'approve' | 'reject' | 'review' | 'download' | 'edit';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  onClick: () => void;
}
```

---

## 🧭 네비게이션 설계

### 관리자 사이드바 확장

#### 학생 모드 (기존)
```
- Home
- Day 1 (8/19 화)
- Day 2 (8/20 수)  
- Day 3 (8/21 목)
```

#### 관리자 모드 (추가)
```
- Home
- Day 1 (8/19 화)
- Day 2 (8/20 수)
- Day 3 (8/21 목)
───────────────────── ← 구분선
🛡️ 관리자 메뉴
- 📊 대시보드
- 👥 학생 관리
  ├── 📋 명단 조회
  ├── 📤 CSV 업로드
  └── 📈 진행도 분석
- 📝 과제 관리
  ├── 📋 제출 현황
  ├── ✍️ 검토 대기
  └── 📊 성적 분석
- 📈 리포트
- ⚙️ 설정
```

### 권한 기반 네비게이션
```typescript
// 기존 sidebarData 확장
interface AdminSidebarItem extends SidebarItem {
  adminOnly?: boolean;
  roles?: ('admin' | 'instructor')[];
  badge?: {
    count: number;
    color: string;
  };
}

// 동적 렌더링
const sidebarItems = useMemo(() => {
  return filterByRole(allSidebarItems, user.role);
}, [user.role]);
```

### 브레드크럼 네비게이션
```typescript
// 관리자 페이지용 브레드크럼 추가
interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: LucideIcon;
}

// 예시: 관리자 > 과제 관리 > Day 1 과제 > 검토
```

---

## 🚀 구현 로드맵

### Phase 1: 기본 관리자 레이아웃 (1주)
- [ ] 관리자 권한 라우팅 설정
- [ ] 관리자 사이드바 확장
- [ ] 기본 관리자 페이지 레이아웃
- [ ] 권한 기반 네비게이션 구현

### Phase 2: 학생 관리 페이지 (1-2주)
- [ ] 학생 명단 테이블 컴포넌트
- [ ] CSV 업로드 컴포넌트
- [ ] 검색 및 필터링 기능
- [ ] 학생 상태 변경 모달
- [ ] 백엔드 API 연동

### Phase 3: 과제 관리 페이지 (1-2주)
- [ ] 과제 제출 현황 대시보드
- [ ] 과제 검토 인터페이스
- [ ] 파일 뷰어 컴포넌트
- [ ] 점수 입력 및 피드백 폼
- [ ] 일괄 처리 기능

### Phase 4: 대시보드 및 분석 (1주)
- [ ] 전체 현황 대시보드
- [ ] 차트 및 그래프 컴포넌트
- [ ] 실시간 알림 시스템
- [ ] 리포트 생성 기능

### Phase 5: 고급 기능 (1주)
- [ ] 실시간 업데이트 (WebSocket)
- [ ] 알림 및 메시지 시스템
- [ ] 키보드 단축키
- [ ] 다크 모드 지원

---

## 📋 컴포넌트 파일 구조

```
src/
├── components/
│   ├── admin/                    # 관리자 전용 컴포넌트
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── Students/
│   │   │   ├── StudentManagement.tsx
│   │   │   ├── StudentTable.tsx
│   │   │   ├── CSVUpload.tsx
│   │   │   └── StudentModal.tsx
│   │   ├── Assignments/
│   │   │   ├── AssignmentDashboard.tsx
│   │   │   ├── SubmissionList.tsx
│   │   │   ├── ReviewPanel.tsx
│   │   │   └── FileViewer.tsx
│   │   ├── Analytics/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   └── ReportGenerator.tsx
│   │   └── shared/               # 관리자 공통 컴포넌트
│   │       ├── AdminLayout.tsx
│   │       ├── AdminTable.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── ActionButton.tsx
│   │       └── SearchAndFilter.tsx
│   └── ... (기존 컴포넌트)
├── pages/
│   ├── admin/                    # 관리자 페이지
│   │   ├── AdminDashboardPage.tsx
│   │   ├── StudentManagementPage.tsx
│   │   ├── AssignmentManagementPage.tsx
│   │   └── AnalyticsPage.tsx
│   └── ... (기존 페이지)
├── hooks/
│   ├── admin/                    # 관리자 전용 훅
│   │   ├── useAdminAuth.ts
│   │   ├── useStudentManagement.ts
│   │   ├── useAssignmentReview.ts
│   │   └── useAdminAnalytics.ts
│   └── ... (기존 훅)
└── types/
    ├── admin.ts                  # 관리자 관련 타입 정의
    └── ... (기존 타입)
```

---

## 🎯 핵심 원칙 요약

1. **일관성**: 기존 디자인 시스템 100% 활용
2. **차별화**: amber/orange 계열로 관리자 영역 구분
3. **효율성**: 한 화면에 최대한 많은 정보와 빠른 액션
4. **직관성**: 기존 사용자 경험 패턴 유지
5. **확장성**: 향후 기능 추가 고려한 컴포넌트 설계

이 설계안을 바탕으로 단계별로 구현하면 기존 학생용 페이지와 완벽하게 어우러지는 관리자 페이지를 만들 수 있습니다.

## 🔗 관련 문서 및 확장 계획

### 연관 문서
- 📋 [BACKEND.md - 백엔드 아키텍처 및 개발 계획](./BACKEND.md)
- 🚀 [DEVELOPMENT_PLAN.md - 프론트엔드 개발 계획](./DEVELOPMENT_PLAN.md)

### 향후 확장 계획 (Phase 5+)
관리자 페이지의 기본 기능 구현 완료 후, 다음과 같은 고급 기능들을 추가할 예정입니다:

**🎯 콘텐츠 관리 고도화**
- 실시간 마크다운 에디터 (Monaco Editor)
- 콘텐츠 버전 관리 및 롤백 기능
- 동적 콘텐츠 블록 및 개인화

**📊 고급 분석 대시보드**  
- 실시간 학습 현황 모니터링
- AI 기반 학습 패턴 분석
- 자동 리포트 생성 및 배포

**🔧 시스템 관리 도구**
- 시스템 설정 UI
- 로그 조회 및 분석
- 성능 모니터링 대시보드

> 📋 상세 계획: [DEVELOPMENT_PLAN.md - 후순위 개발 계획 (Phase 5+)](./DEVELOPMENT_PLAN.md#🔮-후순위-개발-계획-phase-5)