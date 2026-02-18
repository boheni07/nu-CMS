# nu-CMS 배포 가이드 (Deployment Guide)

## 1. 전제 조건 (Prerequisites)
이 프로젝트를 실행하기 위해 다음 소프트웨어가 설치되어 있어야 합니다.

- **Java Development Kit (JDK)**: 버전 21 이상 (LTS)
- **Node.js**: 버전 18 이상 (LTS)
- **MariaDB**: 버전 10.6 이상
- **Maven**: 3.8 이상 (또는 IDE 내장 Maven 사용)

## 2. 데이터베이스 설정 (Database Setup)

### 2.1 스키마 생성
MariaDB 클라이언트에서 다음 명령을 실행하여 데이터베이스를 생성합니다.
```sql
CREATE DATABASE nucms DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.2 테이블 및 초기 데이터 생성
프로젝트 루트 경로에 있는 `*.sql` 파일들을 다음 순서로 실행합니다.
(또는 `run_db_setup.bat` 스크립트가 있다면 실행)

1. `create_member_tables.sql` (회원/권한)
2. `create_workflow_tables.sql` (워크플로우)
3. `create_dam_tables.sql` (미디어/DAM)
4. `FIX_...` (기타 보정 스크립트가 있다면 실행)

## 3. 백엔드 설정 및 실행 (Backend)

### 3.1 환경 설정
`src/main/resources/application.yml` 파일을 열어 환경에 맞게 수정합니다.

```yaml
spring:
  datasource:
    url: jdbc:mariadb://localhost:3306/nucms
    username: root    # DB 계정
    password: root    # DB 비밀번호

cms:
  file:
    upload-path: c:/Users/asus/dev/nu-CMS/uploads # 실제 파일 저장 경로 (변경 필요 시 수정)
```

### 3.2 실행
터미널에서 프로젝트 루트로 이동 후 다음 명령을 실행합니다.

```bash
# Maven Wrapper가 있다면
./mvnw spring-boot:run

# Maven이 설치되어 있다면
mvn spring-boot:run
```
서버가 정상적으로 시작되면 `http://localhost:8080` 에서 백엔드가 대기 상태가 됩니다.

## 4. 프론트엔드 설정 및 실행 (Frontend)

### 4.1 의존성 설치
```bash
cd frontend
npm install
```

### 4.2 개발 모드 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` (또는 터미널에 표시된 포트)으로 접속하여 시스템을 확인합니다.

### 4.3 프로덕션 빌드
```bash
npm run build
```
빌드 결과물은 `frontend/dist` 폴더에 생성됩니다.

## 5. 배포 시 유의사항
- **운영 환경**에서는 `application.yml`의 `spring.jpa.hibernate.ddl-auto` 설정을 `validate` 또는 `none`으로 변경하여 데이터 손실을 방지하십시오.
- **파일 업로드 경로**는 서버의 실제 경로로 반드시 변경해야 하며, 해당 경로에 쓰기 권한이 있는지 확인해야 합니다.
- **보안**: 운영 배포 시 기본 관리자 비밀번호(`admin/admin`)는 반드시 변경하십시오.
