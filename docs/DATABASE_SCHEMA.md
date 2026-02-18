# nu-CMS 데이터베이스 스키마

## 1. 개요
- **Database**: MariaDB
- **Engine**: InnoDB
- **Charset**: utf8mb4 (이모지 지원)

## 2. 주요 테이블 명세

### 2.1 회원 및 권한 (Member & Auth)
| 테이블명 | 설명 | 주요 컬럼 |
| :--- | :--- | :--- |
| `CMS_MEMBER` | 회원 기본 정보 | `ESNTL_ID` (PK), `MBER_ID`, `PASSWORD`, `MBER_STTUS_CODE` |
| `CMS_ROLE` | 역할 정의 | `ROLE_CODE` (PK), `ROLE_NM` |
| `CMS_MEMBER_ROLE` | 회원-역할 매핑 | `ESNTL_ID` (FK), `ROLE_CODE` (FK) |

### 2.2 콘텐츠 및 게시판 (Content & Board)
| 테이블명 | 설명 | 주요 컬럼 |
| :--- | :--- | :--- |
| `CMS_CONTENT` | 정적 페이지 콘텐츠 | `CNT_ID` (PK), `CNT_SJ` (제목), `CNT_CN` (내용), `USE_AT` |
| `CMS_CATEGORY` | 콘텐츠 카테고리 | `CTGRY_ID` (PK), `CTGRY_NM`, `UPPER_CTGRY_ID`, `USE_AT` |
| `CMS_BOARD_MASTER` | 게시판 설정 | `BBS_ID` (PK), `BBS_NM`, `BBS_TY_CODE` (유형) |
| `CMS_BOARD_POST` | 게시글 | `NTT_ID` (PK), `BBS_ID` (FK), `NTT_SJ`, `NTT_CN` |

### 2.3 워크플로우 (Workflow)
| 테이블명 | 설명 | 주요 컬럼 |
| :--- | :--- | :--- |
| `CMS_WORKFLOW_REQUEST` | 승인 요청 정보 | `REQ_ID` (PK), `TARGET_ID`, `STATUS`, `DATA_SNAPSHOT` |
| `CMS_WORKFLOW_HISTORY` | 처리 이력 | `HIST_ID` (PK), `REQ_ID` (FK), `ACTION_CODE`, `ACTOR_ID` |

### 2.4 미디어 관리 (DAM)
| 테이블명 | 설명 | 주요 컬럼 |
| :--- | :--- | :--- |
| `COMTNFILE` | 파일 마스터 (eGov) | `ATCH_FILE_ID` (PK) |
| `COMTNFILEDETAIL` | 파일 상세 정보 | `ATCH_FILE_ID`, `FILE_SN`, `STRE_FILE_NM`, `ORIGNL_FILE_NM` |
| `CMS_MEDIA_FOLDER` | 미디어 폴더 구조 | `FOLDER_ID` (PK), `UPPER_FOLDER_ID`, `FOLDER_NM` |

### 2.5 시스템 및 기타 (System)
| 테이블명 | 설명 | 주요 컬럼 |
| :--- | :--- | :--- |
| `CMS_MENU` | 메뉴 구조 | `MENU_ID` (PK), `UPPER_MENU_ID`, `MENU_NM`, `CONECT_URL` |
| `CMS_MENU_ROLE` | 메뉴 권한 | `MENU_ID` (PK, FK), `ROLE_CODE` (PK, FK) |
| `CMS_WIDGET` | 위젯 설정 | `WIDGET_ID` (PK), `WIDGET_TY_CODE`, `WIDGET_CN` |
| `CMS_ACCESS_LOG` | 접근 로그 | `LOG_ID` (PK), `CONECT_IP`, `CONECT_URL` |

## 3. 관계 다이어그램 (텍스트)
- `CMS_MEMBER` (1) : (N) `CMS_MEMBER_ROLE` (N) : (1) `CMS_ROLE`
- `CMS_BOARD_MASTER` (1) : (N) `CMS_BOARD_POST`
- `CMS_TEMPLATE` (1) : (N) `CMS_LAYOUT_CONFIG` (N) : (1) `CMS_WIDGET`
- `CMS_WORKFLOW_REQUEST` (1) : (N) `CMS_WORKFLOW_HISTORY`
