# nu-CMS 시스템 아키텍처

## 1. 개요
nu-CMS는 전자정부 표준 프레임워크 4.2 (Spring Boot 3.2 기반)와 React 프론트엔드를 결합한 하이브리드 아키텍처를 채택하고 있습니다.
안정적인 공공 서비스 제공을 위한 보안성과, 최신 웹 트렌드를 반영한 사용자 경험(UX)을 동시에 만족시키는 것을 목표로 합니다.

## 2. 기술 스택 (Tech Stack)

### Backend
- **Framework**: Spring Boot 3.2.2 (EgovFrame 4.2 호환)
- **Language**: Java 21 (LTS)
- **Database**: MariaDB 10.6+
- **Persistence**: MyBatis 3.0.3
- **Security**: Spring Security (BCrypt 암호화, 역할 기반 접근 제어)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS + CSS Modules (일부 Tailwind CSS 사용 가능)
- **HTTP Client**: Axios

## 3. 시스템 구조 (System Structure)

### 3.1 디렉토리 구조
```
nu-CMS/
├── docs/                # 프로젝트 문서 (매뉴얼, 아키텍처 등)
├── frontend/            # React 프론트엔드 프로젝트
│   ├── public/          # 정적 리소스
│   └── src/
│       ├── api/         # 백엔드 API 호출 모듈
│       ├── assets/      # 이미지, 폰트 등 에셋
│       ├── layouts/     # 페이지 레이아웃 컴포넌트
│       ├── pages/       # 라우트별 페이지 컴포넌트
│       └── App.jsx      # 메인 앱 컴포넌트
├── src/                 # Spring Boot 백엔드 소스
│   └── main/
│       ├── java/com/nucms/
│       │   └── cms/
│       │       ├── web/         # 컨트롤러 (API 엔드포인트)
│       │       ├── service/     # 비즈니스 로직
│       │       ├── mapper/      # DB 접근 (MyBatis)
│       │       └── model/       # DTO/VO 객체
│       └── resources/
│           ├── mapper/          # MyBatis XML 매퍼
│           └── application.yml  # 설정 파일
└── pom.xml              # Maven 의존성 설정
```

### 3.2 데이터 흐름 (Data Flow)
1. **Client (Browser)**: React 앱에서 사용자가 액션 수행 (예: 저장 버튼 클릭)
2. **API Request**: Axios를 통해 `/api/cms/...` 엔드포인트로 JSON 데이터 전송
3. **Controller**: Spring Boot 컨트롤러가 요청 수신 및 유효성 검증
4. **Service**: 비즈니스 로직 수행 (트랜잭션 관리, 권한 체크)
5. **Mapper**: MyBatis를 통해 SQL 쿼리 실행
6. **Database**: MariaDB에서 데이터 CRUD 수행
7. **Response**: 처리 결과를 JSON 형태로 클라이언트에 반환

## 4. 주요 컴포넌트

### 4.1 인증/인가 (Authentication/Authorization)
- `CmsMemberController`: 로그인, 로그아웃 처리
- Spring Security Filter Chain을 통해 URL별 접근 권한 제어
- JWT 또는 Session 기반 인증 방식 지원

### 4.2 콘텐츠 관리 (Content Management)
- `CmsContentController`: 게시물, 페이지 관리
- `CmsDamController`: 디지털 자산(파일) 관리 및 메타데이터 처리

### 4.3 워크플로우 (Workflow)
- `CmsWorkflowController`: 승인 요청, 결재, 반려 프로세스 처리
- 상태 기반(State-based) 워크플로우 엔진 내장
