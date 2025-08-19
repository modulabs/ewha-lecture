# 백엔드 아키텍처 및 개발 계획

> 이화여자대학교 AI 에이전트 개발 과정 - 백엔드 시스템 설계 및 로드맵

## 📚 목차
1. [현재 상태](#현재-상태)
2. [목표 시스템 개요](#목표-시스템-개요)
3. [기술 스택](#기술-스택)
4. [데이터베이스 설계](#데이터베이스-설계)
5. [API 설계](#api-설계)
6. [보안 설계](#보안-설계)
7. [배포 전략](#배포-전략)
8. [개발 로드맵](#개발-로드맵)

---

## 🏁 현재 상태

### 현재 아키텍처
```
Frontend Only (Static Site)
├── React SPA (https://modulabs.github.io)
├── GitHub Pages 호스팅
├── 로컬 스토리지 기반 상태 관리
└── 정적 마크다운 파일 렌더링

예정 백엔드 서버: https://modulabs.ddns.net/ewha
```

**한계점**:
- 사용자 인증 없음
- 학습 진행도 서버 동기화 불가
- 과제 제출 기능 없음
- 관리자 기능 없음
- 데이터 분석 불가

---

## 🎯 목표 시스템 개요

### 계획된 주요 기능
1. **사용자 관리**: 로그인/회원가입, 권한 관리
2. **학습 추적**: 실시간 학습 진행도 로깅
3. **학습 분석**: 개인/전체 학습률 통계
4. **관리자 시스템**: 사용자 관리, 컨텐츠 관리
5. **과제 시스템**: 제출, 검토, 승인 워크플로우
6. **진도 제어**: 승인 기반 단계별 컨텐츠 잠금 해제

### 목표 아키텍처
```
Client (React SPA)
  https://modulabs.github.io
    ↕ HTTPS API Calls
Backend API Server
  https://modulabs.ddns.net/ewha
    ↕ ORM (SQLAlchemy)
Database (PostgreSQL)
    ↕ 
File Storage (로컬)
```

---

## 🛠 기술 스택

### 백엔드 프레임워크
**선택: Python + FastAPI**

**선택 이유**:
- 자동 API 문서화 (OpenAPI/Swagger) 내장
- 타입 검증 및 자동 직렬화/역직렬화
- 높은 성능 및 비동기 처리 우수
- AI/ML 연동 용이 (향후 확장 고려)
- PostgreSQL + SQLAlchemy 안정적 조합

**대안 비교**:
- **Express.js**: 프론트와 언어 통일, 풍부한 레퍼런스
- **Spring Boot**: 엔터프라이즈 안정성, 다소 무거움
- **Django**: Python 생태계, 개발 속도 빠름

### 데이터베이스
**주 데이터베이스: PostgreSQL 15+**
- ACID 트랜잭션 지원
- JSON/JSONB 컬럼 지원
- SQLAlchemy ORM 연동
- 확장성 및 성능 우수

**캐시: Redis 7+**
- JWT 토큰 블랙리스트
- 세션 스토어
- API 응답 캐싱
- 실시간 데이터 임시 저장

### 파일 스토리지
**로컬 스토리지 + 선택적 S3**
- 과제 파일 업로드
- 사용자 프로필 이미지
- 로컬 디스크 기본, S3 호환 스토리지 옵션

### 인증 & 보안
- **JWT**: RS256 알고리즘 기반 인증
- **bcrypt**: 비밀번호 해싱
- **FastAPI Security**: OAuth2 + JWT 내장 지원
- **Rate Limiting**: slowapi 라이브러리
- **CORS**: 도메인 기반 접근 제어

### 배포 & 인프라
**대상 서버: modulabs.ddns.net**
- **Docker + Docker Compose**: 컨테이너화 배포
- **Nginx**: 리버스 프록시, SSL 터미네이션
- **Let's Encrypt**: 무료 SSL 인증서
- **PostgreSQL**: 도커 컨테이너로 운영

---

## 🗄 데이터베이스 설계

### 주요 테이블 구조
```
사용자 관리:
- users: 사용자 기본 정보, 권한
- user_sessions: 로그인 세션 관리
- allowed_students: 허용된 학생 명단 (CSV 업로드)

학습 관리:
- content_items: 콘텐츠 메타데이터
- user_progress: 개별 학습 진행도
- learning_logs: 상세 학습 로그

과제 시스템:
- assignments: 과제 정보
- submissions: 과제 제출
- reviews: 과제 검토 및 피드백

시스템:
- admin_logs: 관리자 작업 로그
- system_settings: 시스템 설정
```

### 상세 테이블 스키마

#### allowed_students (허용된 학생 명단)
```sql
CREATE TABLE allowed_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  student_id VARCHAR(50),
  cohort VARCHAR(50) NOT NULL,          -- 기수 (예: 2024-08)
  department VARCHAR(100),              -- 학과
  status student_status DEFAULT 'pending',  -- pending, registered, blocked
  uploaded_by UUID REFERENCES users(id),   -- 업로드한 관리자
  uploaded_at TIMESTAMP DEFAULT NOW(),
  registered_at TIMESTAMP,             -- 실제 가입 시점
  notes TEXT,                          -- 관리자 메모
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 학생 상태 열거형
CREATE TYPE student_status AS ENUM ('pending', 'registered', 'blocked');
```

#### submissions (과제 제출 확장)
```sql
-- 기존 submissions 테이블에 관리자 검토 필드 추가
ALTER TABLE submissions ADD COLUMN reviewer_id UUID REFERENCES users(id);
ALTER TABLE submissions ADD COLUMN review_status review_status DEFAULT 'pending';
ALTER TABLE submissions ADD COLUMN score INTEGER CHECK (score >= 0 AND score <= 100);
ALTER TABLE submissions ADD COLUMN feedback TEXT;
ALTER TABLE submissions ADD COLUMN reviewed_at TIMESTAMP;

-- 검토 상태 열거형
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'needs_revision');
```

#### admin_logs (관리자 작업 로그 확장)
```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) NOT NULL,
  action admin_action NOT NULL,
  target_type VARCHAR(50),              -- user, submission, student_list
  target_id UUID,                       -- 대상 객체 ID
  details JSONB,                        -- 상세 정보
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 관리자 액션 열거형
CREATE TYPE admin_action AS ENUM (
  'student_list_upload',
  'submission_review',
  'user_block',
  'user_unblock',
  'assignment_create',
  'system_settings_update'
);
```

### 사용자 권한 체계
- **student**: 일반 학생 (기본)
- **instructor**: 강사 (과제 검토 권한)
- **admin**: 관리자 (전체 관리 권한)

---

## 📡 API 설계

### API 구조
```
/api/v1/
├── auth/          # 인증 관련
├── users/         # 사용자 관리
├── content/       # 콘텐츠 관리
├── progress/      # 학습 진행도
├── assignments/   # 과제 시스템
├── analytics/     # 분석 데이터
└── admin/         # 관리자 기능
    ├── submissions/       # 과제 제출 관리
    ├── students/          # 학생 명단 관리
    └── analytics/         # 관리자 대시보드
```

### 주요 엔드포인트
- **POST /auth/login**: 로그인
- **POST /auth/register**: 회원가입
- **GET /content/items**: 콘텐츠 목록
- **POST /progress/update**: 진행도 업데이트
- **POST /assignments/submit**: 과제 제출
- **GET /analytics/dashboard**: 대시보드 데이터

**관리자 전용:**
- **GET /admin/submissions**: 모든 과제 제출 현황
- **POST /admin/submissions/{id}/review**: 과제 검토 및 점수 부여
- **POST /admin/students/upload-csv**: 학생 명단 CSV 업로드
- **GET /admin/students**: 허용된 학생 명단 조회
- **GET /admin/analytics/overview**: 관리자 대시보드

---

## 📋 API 데이터 스키마

### 공통 응답 형식
```json
{
  "success": true,
  "data": {...},
  "message": "Success",
  "timestamp": "2025-01-01T00:00:00Z"
}

// 에러 응답
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {...}
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 1. 인증 API (/api/v1/auth/)

#### POST /auth/register - 회원가입
**요청:**
```json
{
  "email": "student@ewha.ac.kr",
  "password": "securePassword123",
  "name": "김이화",
  "student_id": "2024123456",
  "cohort": "2024-08"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "student@ewha.ac.kr",
      "name": "김이화",
      "role": "student",
      "student_id": "2024123456",
      "cohort": "2024-08",
      "created_at": "2025-01-01T00:00:00Z"
    },
    "tokens": {
      "access_token": "jwt-access-token",
      "refresh_token": "jwt-refresh-token",
      "expires_in": 3600
    }
  }
}
```

#### POST /auth/login - 로그인
**요청:**
```json
{
  "email": "student@ewha.ac.kr",
  "password": "securePassword123"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "student@ewha.ac.kr",
      "name": "김이화",
      "role": "student",
      "last_login_at": "2025-01-01T00:00:00Z"
    },
    "tokens": {
      "access_token": "jwt-access-token",
      "refresh_token": "jwt-refresh-token",
      "expires_in": 3600
    }
  }
}
```

#### POST /auth/refresh - 토큰 갱신
**요청:**
```json
{
  "refresh_token": "jwt-refresh-token"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "access_token": "new-jwt-access-token",
    "expires_in": 3600
  }
}
```

### 2. 콘텐츠 API (/api/v1/content/)

#### GET /content/items - 콘텐츠 목록
**요청:** (Query Parameters)
```
?day=1&include_locked=false
```

**응답:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid-string",
        "path": "/day1/01_onboarding",
        "title": "AI 에이전트 개발 온보딩",
        "day": 1,
        "session_order": 1,
        "content_type": "lesson",
        "estimated_duration_minutes": 60,
        "is_locked": false,
        "unlock_condition": "always",
        "user_progress": {
          "status": "completed",
          "completion_percentage": 100,
          "time_spent_minutes": 45,
          "completed_at": "2025-01-01T00:00:00Z"
        }
      }
    ],
    "total_count": 15,
    "completed_count": 3
  }
}
```

### 3. 진행도 API (/api/v1/progress/)

#### POST /progress/update - 진행도 업데이트
**요청:**
```json
{
  "content_item_id": "uuid-string",
  "status": "in_progress",
  "completion_percentage": 75,
  "time_spent_minutes": 30
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "id": "uuid-string",
      "content_item_id": "uuid-string",
      "status": "in_progress",
      "completion_percentage": 75,
      "time_spent_minutes": 30,
      "updated_at": "2025-01-01T00:00:00Z"
    }
  }
}
```

#### GET /progress/summary - 전체 진행도 요약
**응답:**
```json
{
  "success": true,
  "data": {
    "overall_progress": {
      "total_items": 15,
      "completed_items": 8,
      "in_progress_items": 2,
      "completion_percentage": 53.3,
      "total_time_spent_minutes": 480
    },
    "daily_progress": [
      {
        "day": 1,
        "total_items": 6,
        "completed_items": 6,
        "completion_percentage": 100
      },
      {
        "day": 2,
        "total_items": 5,
        "completed_items": 2,
        "completion_percentage": 40
      }
    ]
  }
}
```

### 4. 과제 시스템 API (/api/v1/assignments/)

#### GET /assignments - 과제 목록
**응답:**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "uuid-string",
        "title": "Day 1 최종 과제: AI 에이전트 개념 정리",
        "description": "학습한 내용을 바탕으로 AI 에이전트의 주요 개념을 정리하세요",
        "content_item_id": "uuid-string",
        "due_date": "2025-01-05T23:59:59Z",
        "max_file_size_mb": 10,
        "allowed_file_types": ["pdf", "docx", "txt", "md"],
        "submission_status": "submitted",
        "submitted_at": "2025-01-04T10:30:00Z",
        "review_status": "pending",
        "created_at": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /assignments/submit - 과제 제출
**요청:** (Multipart Form Data)
```
assignment_id: uuid-string
comments: "과제 제출합니다. 피드백 부탁드립니다."
file: [binary file data]
```

**응답:**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid-string",
      "assignment_id": "uuid-string",
      "user_id": "uuid-string",
      "file_path": "/uploads/assignments/2025/01/uuid-filename.pdf",
      "file_name": "day1_assignment.pdf",
      "file_size_bytes": 1024000,
      "comments": "과제 제출합니다. 피드백 부탁드립니다.",
      "submitted_at": "2025-01-04T10:30:00Z",
      "status": "submitted"
    }
  }
}
```

#### GET /assignments/{assignment_id}/submissions/{submission_id} - 제출된 과제 조회
**응답:**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid-string",
      "assignment": {
        "id": "uuid-string",
        "title": "Day 1 최종 과제: AI 에이전트 개념 정리"
      },
      "file_name": "day1_assignment.pdf",
      "file_url": "/api/v1/files/assignments/uuid-filename.pdf",
      "comments": "과제 제출합니다.",
      "submitted_at": "2025-01-04T10:30:00Z",
      "review": {
        "status": "approved",
        "score": 85,
        "feedback": "잘 정리하셨습니다. 다음 단계로 진행 가능합니다.",
        "reviewed_by": "instructor@ewha.ac.kr",
        "reviewed_at": "2025-01-05T09:15:00Z"
      }
    }
  }
}
```

### 5. 사용자 API (/api/v1/users/)

#### GET /users/profile - 내 프로필 조회
**응답:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "student@ewha.ac.kr",
      "name": "김이화",
      "role": "student",
      "student_id": "2024123456",
      "cohort": "2024-08",
      "profile_image_url": "/api/v1/files/profiles/uuid-profile.jpg",
      "created_at": "2025-01-01T00:00:00Z",
      "last_login_at": "2025-01-04T10:30:00Z",
      "total_learning_time_minutes": 480,
      "total_completed_items": 8
    }
  }
}
```

### 6. 분석 API (/api/v1/analytics/)

#### GET /analytics/dashboard - 개인 대시보드
**응답:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_progress_percentage": 53.3,
      "total_time_spent_minutes": 480,
      "completed_assignments": 2,
      "pending_assignments": 1,
      "current_day": 2,
      "days_completed": 1
    },
    "recent_activity": [
      {
        "type": "assignment_submitted",
        "title": "Day 1 최종 과제 제출",
        "timestamp": "2025-01-04T10:30:00Z"
      },
      {
        "type": "content_completed",
        "title": "AI 에이전트 트렌드 완료",
        "timestamp": "2025-01-04T09:15:00Z"
      }
    ],
    "upcoming_deadlines": [
      {
        "assignment_id": "uuid-string",
        "title": "Day 2 중간 과제",
        "due_date": "2025-01-07T23:59:59Z",
        "days_remaining": 3
      }
    ]
  }
}
```

### 7. 관리자 API (/api/v1/admin/)

#### GET /admin/submissions - 모든 과제 제출 현황 조회
**요청:** (Query Parameters)
```
?assignment_id=uuid-string&status=pending&cohort=2024-08&page=1&limit=20
```

**응답:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid-string",
        "assignment": {
          "id": "uuid-string",
          "title": "Day 1 최종 과제: AI 에이전트 개념 정리",
          "due_date": "2025-01-05T23:59:59Z"
        },
        "student": {
          "id": "uuid-string",
          "name": "김이화",
          "email": "student@ewha.ac.kr",
          "student_id": "2024123456",
          "cohort": "2024-08"
        },
        "file_name": "day1_assignment.pdf",
        "file_url": "/api/v1/files/assignments/uuid-filename.pdf",
        "file_size_bytes": 1024000,
        "comments": "과제 제출합니다.",
        "submitted_at": "2025-01-04T10:30:00Z",
        "review_status": "pending",
        "score": null,
        "feedback": null,
        "reviewed_at": null,
        "reviewer_name": null
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 89,
      "limit": 20
    },
    "summary": {
      "total_submissions": 89,
      "pending_review": 25,
      "approved": 50,
      "rejected": 14
    }
  }
}
```

#### POST /admin/submissions/{submission_id}/review - 과제 검토 및 점수 부여
**요청:**
```json
{
  "review_status": "approved",
  "score": 85,
  "feedback": "잘 정리하셨습니다. 다음 단계로 진행하세요."
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "review": {
      "submission_id": "uuid-string",
      "review_status": "approved",
      "score": 85,
      "feedback": "잘 정리하셨습니다. 다음 단계로 진행하세요.",
      "reviewer_id": "uuid-string",
      "reviewed_at": "2025-01-05T09:15:00Z"
    }
  }
}
```

#### GET /admin/assignments/{assignment_id}/submissions - 특정 과제의 모든 제출물
**응답:**
```json
{
  "success": true,
  "data": {
    "assignment": {
      "id": "uuid-string",
      "title": "Day 1 최종 과제: AI 에이전트 개념 정리",
      "description": "학습한 내용을 바탕으로 AI 에이전트의 주요 개념을 정리하세요",
      "due_date": "2025-01-05T23:59:59Z",
      "total_students": 30,
      "submitted_count": 25
    },
    "submissions": [
      {
        "id": "uuid-string",
        "student": {
          "name": "김이화",
          "email": "student@ewha.ac.kr",
          "student_id": "2024123456"
        },
        "file_name": "day1_assignment.pdf",
        "file_url": "/api/v1/files/assignments/uuid-filename.pdf",
        "submitted_at": "2025-01-04T10:30:00Z",
        "review_status": "pending",
        "score": null
      }
    ],
    "not_submitted_students": [
      {
        "id": "uuid-string",
        "name": "박학생",
        "email": "student2@ewha.ac.kr",
        "student_id": "2024123457"
      }
    ]
  }
}
```

#### POST /admin/students/upload-csv - 허용 학생 명단 CSV 업로드
**요청:** (Multipart Form Data)
```
cohort: "2024-08"
file: [CSV file]
replace_existing: true
```

**CSV 파일 형식:**
```csv
name,email,student_id,department
김이화,student1@ewha.ac.kr,2024123456,컴퓨터공학과
박학생,student2@ewha.ac.kr,2024123457,AI학과
이수연,student3@ewha.ac.kr,2024123458,데이터사이언스과
```

**응답:**
```json
{
  "success": true,
  "data": {
    "upload_summary": {
      "total_rows": 30,
      "successful_imports": 28,
      "skipped_duplicates": 2,
      "errors": 0,
      "cohort": "2024-08"
    },
    "imported_students": [
      {
        "name": "김이화",
        "email": "student1@ewha.ac.kr",
        "student_id": "2024123456",
        "department": "컴퓨터공학과",
        "status": "pending"
      }
    ],
    "errors": [],
    "skipped": [
      {
        "row": 15,
        "email": "duplicate@ewha.ac.kr",
        "reason": "이미 존재하는 이메일"
      }
    ]
  }
}
```

#### GET /admin/students - 허용된 학생 명단 조회
**요청:** (Query Parameters)
```
?cohort=2024-08&status=pending&search=김이화&page=1&limit=50
```

**응답:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "uuid-string",
        "name": "김이화",
        "email": "student@ewha.ac.kr",
        "student_id": "2024123456",
        "department": "컴퓨터공학과",
        "cohort": "2024-08",
        "status": "registered",
        "uploaded_at": "2025-01-01T00:00:00Z",
        "registered_at": "2025-01-02T10:30:00Z",
        "uploaded_by_name": "관리자",
        "notes": ""
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_count": 120,
      "limit": 50
    },
    "summary": {
      "total_allowed": 120,
      "registered": 85,
      "pending": 30,
      "blocked": 5
    }
  }
}
```

#### PUT /admin/students/{student_id} - 학생 상태 변경
**요청:**
```json
{
  "status": "blocked",
  "notes": "부적절한 행동으로 인한 차단"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "uuid-string",
      "status": "blocked",
      "notes": "부적절한 행동으로 인한 차단",
      "updated_at": "2025-01-05T14:30:00Z"
    }
  }
}
```

#### GET /admin/analytics/overview - 관리자 전체 현황 대시보드
**응답:**
```json
{
  "success": true,
  "data": {
    "students_summary": {
      "total_allowed": 120,
      "registered": 85,
      "active_today": 42,
      "completion_rate": 67.5
    },
    "assignments_summary": {
      "total_assignments": 15,
      "pending_reviews": 25,
      "avg_score": 82.5,
      "late_submissions": 8
    },
    "learning_progress": {
      "avg_progress_percentage": 65.2,
      "completed_students": 28,
      "at_risk_students": 12
    },
    "recent_activity": [
      {
        "type": "assignment_submitted",
        "student_name": "김이화",
        "assignment_title": "Day 2 중간 과제",
        "timestamp": "2025-01-05T10:30:00Z"
      },
      {
        "type": "student_registered",
        "student_name": "박학생",
        "timestamp": "2025-01-05T09:15:00Z"
      }
    ]
  }
}
```

### 인증 헤더
모든 보호된 API 요청시 포함:
```
Authorization: Bearer {access_token}
Content-Type: application/json

# 관리자 권한 필요한 API
Role: admin 또는 instructor (과제 검토는 instructor도 가능)
```

---

## 🔒 보안 설계

### CORS 설정
```
허용 도메인:
- https://modulabs.github.io/ewha (프로덕션)
- http://localhost:5177 (개발)
- http://localhost:3432 (개발 대안)

허용 메서드: GET, POST, PUT, DELETE, OPTIONS
인증 정보 포함: credentials: true
```

### JWT 토큰 관리
- **알고리즘**: RS256 (비대칭 키)
- **만료 시간**: Access Token 1시간, Refresh Token 7일
- **블랙리스트**: Redis에 로그아웃된 토큰 관리
- **토큰 갱신**: Refresh Token을 통한 자동 갱신

### 보안 조치
- HTTPS 강제 리다이렉트
- SQL Injection 방지 (ORM 사용)
- XSS 방지 (입력 새니타이제이션)
- Rate Limiting (API 호출 제한)
- 정기적인 보안 업데이트

---

## 🚀 배포 전략

### modulabs.ddns.net 서버 사양
```
권장 사양:
- OS: Ubuntu 22.04 LTS
- RAM: 4GB+
- Storage: 20GB+ SSD
- Network: DDNS 설정 완료
- Domain: modulabs.ddns.net
- Base Url: https://modulabs.ddns.net/ewha
```

### Docker Compose 구성
```
서비스 구성:
- nginx: 리버스 프록시, SSL 터미네이션
- api: FastAPI 애플리케이션
- postgres: PostgreSQL 데이터베이스
- redis: Redis 캐시
- backup: 자동 데이터베이스 백업
```

### SSL 및 도메인 설정
- **Let's Encrypt**: 자동 SSL 인증서 갱신
- **HTTP → HTTPS**: 자동 리다이렉트
- **CORS 헤더**: Nginx에서 설정

---

## 📅 개발 로드맵

### Phase 1: 기본 인프라 (2-3주)
**목표**: modulabs.ddns.net 서버에 기본 백엔드 구축

#### 주요 작업
- [ ] FastAPI 프로젝트 초기화 및 구조 설계
- [ ] PostgreSQL + SQLAlchemy 모델 정의
- [ ] Docker Compose 환경 구성
- [ ] modulabs.ddns.net 서버 환경 구축
- [ ] Nginx + SSL 설정
- [ ] CORS 설정 (modulabs.github.io 허용)

**완료 기준**: 
- https://modulabs.github.io에서 CORS 없이 API 호출 성공
- 기본 서버 인프라 안정적 동작

### Phase 2: 인증 시스템 (1-2주)
**목표**: JWT 기반 사용자 인증 구현

#### 주요 작업
- [ ] 사용자 모델 및 권한 시스템
- [ ] JWT 토큰 발급/검증 로직
- [ ] 회원가입/로그인 API
- [ ] 미들웨어 (인증, 권한 검사)
- [ ] Rate Limiting 적용

**완료 기준**: 
- 프론트엔드에서 로그인/회원가입 완전 동작
- JWT 토큰 기반 API 인증 작동

### Phase 3: 학습 시스템 (2-3주)
**목표**: 학습 진행도 추적 및 관리

#### 주요 작업
- [ ] 콘텐츠 메타데이터 관리
- [ ] 학습 진행도 API
- [ ] 실시간 학습 로그 수집
- [ ] 기본 분석 대시보드 API

**완료 기준**: 
- 프론트엔드 진행도가 서버와 실시간 동기화
- 기본 학습 통계 제공

### Phase 4: 과제 시스템 (2-3주)
**목표**: 과제 제출 및 검토 워크플로우

#### 주요 작업
- [ ] 파일 업로드 시스템
- [ ] 과제 제출/검토 API
- [ ] 이메일 알림 시스템
- [ ] 관리자 대시보드

**완료 기준**: 
- 과제 제출부터 검토까지 전체 워크플로우 동작
- 관리자가 학습 현황 모니터링 가능

### Phase 5: 콘텐츠 이관 및 고도화 (향후 계획)
**목표**: public 폴더 콘텐츠의 점진적 백엔드 이관

> 🔗 **연관 문서**: [DEVELOPMENT_PLAN.md - 후순위 개발 계획 (Phase 5+)](./DEVELOPMENT_PLAN.md#🔮-후순위-개발-계획-phase-5)

#### 현재 문제점
- `public/day1/*.md` 파일들이 누구나 접근 가능
- 콘텐츠 잠금/해제 로직이 클라이언트 사이드에서만 동작
- 진행도가 로컬스토리지에만 저장되어 서버 동기화 불가

#### 이관 전략 (점진적 접근)
**5-1. 메타데이터 관리 (1주)**
- [ ] 기존 마크다운 파일 정보를 `content_items` 테이블에 매핑
- [ ] 파일 경로, 제목, 순서 등 메타데이터 DB 관리
- [ ] 콘텐츠 로드 전 권한 확인 API 구현

**5-2. 접근 제어 강화 (1주)**
- [ ] 콘텐츠 요청 시 JWT 토큰 검증
- [ ] 사용자별 진행도 기반 잠금/해제 로직
- [ ] 프론트엔드에서 권한 확인 후 콘텐츠 렌더링

**5-3. 하이브리드 서빙 (1주)**
- [ ] GET `/api/v1/content/{path}` 엔드포인트 구현
- [ ] 권한 확인 후 public 폴더 파일 프록시 서빙
- [ ] 캐시 헤더 및 성능 최적화

**5-4. 선택적 콘텐츠 이관 (2주)**
- [ ] 민감한 콘텐츠만 백엔드 스토리지로 이관
- [ ] 파일 업로드 API 및 관리자 콘텐츠 편집 기능
- [ ] 버전 관리 및 히스토리 추적

**5-5. 동적 콘텐츠 관리 (2주)**
- [ ] 관리자가 콘텐츠를 실시간 수정 가능한 에디터
- [ ] 개인화된 콘텐츠 제공 (사용자별 맞춤 내용)
- [ ] 콘텐츠 분석 및 개선 도구

#### 완료 기준
- 모든 콘텐츠 접근이 권한 기반으로 제어됨
- 성능 저하 없이 콘텐츠 서빙
- 관리자가 콘텐츠를 동적으로 관리 가능

**우선순위**: 낮음 (Phase 1-4 완료 후 검토)

---

## 💰 비용 예상

### 월간 운영비용 (직접 서버)
```
기본 인프라 비용:
- 서버 인스턴스 (4GB RAM): $20-40/월
- 도메인 & DDNS: 무료
- SSL 인증서: 무료 (Let's Encrypt)
- 기본 대역폭: 포함

선택적 비용:
- 외부 파일 스토리지: $5-10/월
- 모니터링 서비스: $5-15/월
- 백업 스토리지: $3-5/월

총 예상 비용: $20-70/월 (약 3-9만원)
```

### 확장성 고려
- **100명 사용자**: 현재 구성 (4GB RAM 충분)
- **300명 사용자**: 서버 업그레이드 (8GB RAM) (+$20/월)
- **500명+ 사용자**: 로드 밸런서 추가, DB 분리 (+$50/월)

---

## ✅ 체크리스트

### 🔄 Phase 1 (기본 인프라 - modulabs.ddns.net)
- [ ] FastAPI 프로젝트 구조 설계
- [ ] modulabs.ddns.net 서버 Docker 환경 구축
- [ ] PostgreSQL 15+ 데이터베이스 설계 및 설치
- [ ] Nginx + SSL (Let's Encrypt) 설정
- [ ] CORS 설정 (modulabs.github.io 도메인 허용)
- [ ] 기본 헬스체크 API 구현
- [ ] 자동 백업 시스템 구축

### 🔄 Phase 2 (인증 시스템)
- [ ] SQLAlchemy 모델 정의
- [ ] JWT 인증 시스템 (RS256)
- [ ] 사용자 권한 관리 (student/instructor/admin)
- [ ] Rate Limiting 및 보안 미들웨어
- [ ] API 문서화 (FastAPI 자동 생성)

### 🔄 Phase 3 (학습 시스템)
- [ ] 학습 진행도 실시간 동기화
- [ ] 콘텐츠 잠금/해제 로직
- [ ] 학습 분석 대시보드 API
- [ ] 관리자 모니터링 기능

### 🔄 Phase 4 (과제 시스템)
- [ ] 파일 업로드 시스템
- [ ] 과제 제출/검토 워크플로우
- [ ] 이메일 알림 시스템
- [ ] 전체 시스템 통합 테스트

### 🔄 Phase 5 (콘텐츠 이관 - 향후 계획)
- [ ] content_items 테이블에 기존 마크다운 파일 매핑
- [ ] 콘텐츠 접근 권한 확인 API 구현
- [ ] 하이브리드 콘텐츠 서빙 시스템
- [ ] 선택적 콘텐츠 백엔드 이관
- [ ] 관리자 콘텐츠 편집 도구
- [ ] 동적 콘텐츠 관리 및 개인화