# nu-CMS

**nu-CMS**는 전자정부 표준 프레임워크(Spring Boot)와 React를 결합한 현대적인 하이브리드 콘텐츠 관리 시스템입니다.
공공기관 및 기업 환경에 최적화된 강력한 보안성, 유연한 확장성, 그리고 직관적인 사용자 경험을 제공합니다.

## 🚀 주요 기능 (Key Features)

*   **콘텐츠 관리 (CMS)**: 위지윅(WYSIWYG) 에디터를 통한 손쉬운 페이지 관리, 버전 제어 및 복구
*   **게시판 시스템**: 공지사항, 갤러리, Q&A 등 다양한 유형의 게시판 생성 및 관리 (미리보기 모달 지원)
*   **워크플로우**: 콘텐츠 게시 승인/반려 결재 프로세스 내장
*   **디지털 자산 관리 (DAM)**: 이미지 및 파일의 통합 관리, 메타데이터 태깅
*   **시스템 관리**: 동적 메뉴 구성, RBAC 기반 회원 및 권한(메뉴별 접근 제어) 관리, 시스템 감사 로그

## 🛠 기술 스택 (Tech Stack)

### Backend
*   **Java 21 (LTS)**
*   **Spring Boot 3.2** (EgovFrame 4.2 호환 아키텍처)
*   **Spring Security**: 엔터프라이즈급 보안 및 인증/인가
*   **MyBatis**: 효율적인 SQL 매핑
*   **MariaDB**: 데이터 저장소

### Frontend
*   **React 18**: 컴포넌트 기반 UI 개발
*   **Vite**: 초고속 빌드 및 개발 환경
*   **Ant Design (v5)**: 세련되고 통일된 UI 컴포넌트
*   **Axios**: HTTP 클라이언트

## 📦 설치 및 실행 (Getting Started)

### 1. 전제 조건
*   JDK 21+
*   Node.js 18+
*   MariaDB Server

### 2. 백엔드 실행
```bash
# 프로젝트 루트에서
./mvnw spring-boot:run
```
*   서버 포트: `8080` (기본값)
*   초기 DB 스키마는 `docs/DATABASE_SCHEMA.md` 및 `*.sql` 파일 참조

### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```
*   접속 주소: `http://localhost:5173`

## 📚 문서 (Documentation)

*   [📂 사용자 매뉴얼 (User Manual)](docs/MANUAL.md): 기능별 상세 사용법
*   [🏗 시스템 아키텍처 (Architecture)](docs/CMS_ARCHITECTURE.md): 시스템 구조 및 작동 원리 상세
*   [🗄 데이터베이스 스키마 (DB Schema)](docs/DATABASE_SCHEMA.md)
*   [🔌 API 레퍼런스 (API Reference)](docs/API_REFERENCE.md)
*   [🚀 배포 가이드 (Deployment)](docs/DEPLOYMENT.md)

## 📝 라이선스
This project is licensed under the MIT License.