# nu-CMS API 레퍼런스

본 문서는 nu-CMS의 주요 REST API 엔드포인트를 설명합니다.
모든 API는 `/api/cms` 접두사를 가지며, JSON 형식으로 통신합니다.

## 1. 인증 및 사용자 (Authentication & User)
| Method | Endpoint | 설명 | 필요한 권한 |
| :--- | :--- | :--- | :--- |
| POST | `/api/cms/member/login` | 로그인 및 토큰 발급 | - |
| POST | `/api/cms/member/logout` | 로그아웃 | 로그인 필요 |
| GET | `/api/cms/member/me` | 내 정보 조회 | 로그인 필요 |
| GET | `/api/cms/member` | 회원 목록 조회 | ADMIN |
| GET | `/api/cms/member/{id}` | 회원 상세 조회 | ADMIN |
| POST | `/api/cms/member` | 신규 회원 등록 | ADMIN |
| PUT | `/api/cms/member/{id}` | 회원 정보 수정 | ADMIN |
| PATCH | `/api/cms/member/{id}/status` | 회원 상태 변경 | ADMIN |
| POST | `/api/cms/member/{id}/roles` | 회원 권한 부여 | ADMIN |

## 2. 콘텐츠 및 게시판 (Content & Board)
| Method | Endpoint | 설명 | 필요한 권한 |
| :--- | :--- | :--- | :--- |
| GET | `/api/cms/content/list` | 콘텐츠(페이지) 목록 조회 | USER |
| POST | `/api/cms/content` | 콘텐츠 생성 | ADMIN |
| PUT | `/api/cms/content/{id}` | 콘텐츠 수정 | ADMIN |
| DELETE | `/api/cms/content/{id}` | 콘텐츠 삭제 | ADMIN |
| GET | `/api/cms/category` | 카테고리 목록 조회 | USER |
| POST | `/api/cms/category` | 카테고리 생성 | ADMIN |
| PUT | `/api/cms/category/{id}` | 카테고리 수정 | ADMIN |
| DELETE | `/api/cms/category/{id}` | 카테고리 삭제 | ADMIN |
| GET | `/api/cms/board/{bbsId}/posts` | 특정 게시판의 게시물 목록 | USER |
| POST | `/api/cms/board/{bbsId}/post` | 게시물 작성 | USER |

## 3. 워크플로우 (Workflow)
| Method | Endpoint | 설명 | 필요한 권한 |
| :--- | :--- | :--- | :--- |
| POST | `/api/cms/workflow/request` | 승인 요청 생성 | USER |
| GET | `/api/cms/workflow/list` | 요청 목록 조회 | ADMIN |
| POST | `/api/cms/workflow/approve` | 승인 처리 | ADMIN |
| POST | `/api/cms/workflow/reject` | 반려 처리 | ADMIN |

## 4. 미디어 및 DAM (Media & DAM)
| Method | Endpoint | 설명 | 필요한 권한 |
| :--- | :--- | :--- | :--- |
| POST | `/api/cms/dam/upload` | 파일 업로드 (메타데이터 포함) | USER |
| GET | `/api/cms/dam/list` | 미디어 라이브러리 목록 | USER |
| PUT | `/api/cms/dam/{fileId}` | 파일 정보 수정 | USER |

## 5. 시스템 설정 (System Config)
| Method | Endpoint | 설명 | 필요한 권한 |
| :--- | :--- | :--- | :--- |
| GET | `/api/cms/menu/tree` | 메뉴 트리 구조 조회 | USER |
| GET | `/api/cms/role/{roleCode}/menus` | 역할별 메뉴 권한 조회 | ADMIN |
| POST | `/api/cms/role/{roleCode}/menus` | 역할별 메뉴 권한 저장 | ADMIN |
| GET | `/api/cms/config` | 사이트 기본 설정 조회 | - |
| GET | `/api/cms/stats/visitors` | 방문자 통계 데이터 | ADMIN |
