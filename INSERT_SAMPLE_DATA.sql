USE nucms;

-- 1. 게시판 마스터 추가 (갤러리, Q&A)
INSERT IGNORE INTO CMS_BOARD_MASTER (BBS_ID, BBS_NM, BBS_INTRCN, BBS_TY_CODE, USE_AT)
VALUES 
('BBSMSTR_CCCCCCCCCCCC', '갤러리', '이미지 중심의 갤러리 게시판입니다.', 'BBST03', 'Y'),
('BBSMSTR_DDDDDDDDDDDD', '질문답변', '궁금한 점을 물어보세요.', 'BBST04', 'Y');

-- 2. 게시물 샘플 데이터 (공지사항)
INSERT INTO CMS_BOARD_POST (BBS_ID, NTT_SJ, NTT_CN, FRST_REGISTER_ID, RDCNT) VALUES
('BBSMSTR_AAAAAAAAAAAA', 'nu-CMS 서비스 오픈 안내', '안녕하세요. nu-CMS 서비스가 정식 오픈하였습니다.<br>많은 이용 바랍니다.', 'admin', 150),
('BBSMSTR_AAAAAAAAAAAA', '시스템 점검 안내 (2/20)', '2월 20일 새벽 2시부터 4시까지 정기 점검이 있을 예정입니다.', 'admin', 89),
('BBSMSTR_AAAAAAAAAAAA', '개인정보 처리방침 변경 안내', '개인정보 처리방침이 개정되었습니다. 확인 부탁드립니다.', 'admin', 234);

-- 3. 게시물 샘플 데이터 (자유게시판)
INSERT INTO CMS_BOARD_POST (BBS_ID, NTT_SJ, NTT_CN, FRST_REGISTER_ID, RDCNT) VALUES
('BBSMSTR_BBBBBBBBBBBB', '가입 인사 드립니다!', '안녕하세요. 처음 가입했습니다. 잘 부탁드려요.', 'user01', 12),
('BBSMSTR_BBBBBBBBBBBB', 'CMS 기능 정말 좋네요', '생각보다 편리하고 디자인도 깔끔합니다.', 'user02', 45),
('BBSMSTR_BBBBBBBBBBBB', '오늘 점심 메뉴 추천 좀..', '다들 뭐 드시나요? 배고프네요.', 'user03', 28);

-- 4. 게시물 샘플 데이터 (갤러리)
INSERT INTO CMS_BOARD_POST (BBS_ID, NTT_SJ, NTT_CN, FRST_REGISTER_ID, RDCNT) VALUES
('BBSMSTR_CCCCCCCCCCCC', '봄 풍경 사진', '지난 주말에 다녀온 공원 사진입니다.', 'photog', 55),
('BBSMSTR_CCCCCCCCCCCC', '사무실 전경', '우리 사무실 모습입니다. 깔끔하죠?', 'admin', 30);

-- 5. 게시물 샘플 데이터 (질문답변)
INSERT INTO CMS_BOARD_POST (BBS_ID, NTT_SJ, NTT_CN, FRST_REGISTER_ID, RDCNT) VALUES
('BBSMSTR_DDDDDDDDDDDD', '회원 탈퇴는 어떻게 하나요?', '메뉴를 못 찾겠습니다. 알려주세요.', 'guest', 5),
('BBSMSTR_DDDDDDDDDDDD', '글 수정이 안됩니다.', '권한이 없다고 나오는데 확인 부탁드립니다.', 'user01', 10);

-- 6. 메뉴 샘플 데이터
-- 메인 메뉴
INSERT IGNORE INTO CMS_MENU (MENU_ID, MENU_NM, MENU_TY_CODE, EXPSR_ORDR, USE_AT, CONECT_URL) VALUES
('MENU_000000000000001', '사이트 소개', 'HTML', 1, 'Y', '/view/intro'),
('MENU_000000000000002', '커뮤니티', 'DIR', 2, 'Y', '#'),
('MENU_000000000000003', '갤러리', 'BOARD', 3, 'Y', '/view/board/gallery'),
('MENU_000000000000004', '고객지원', 'DIR', 4, 'Y', '#');

-- 서브 메뉴 (커뮤니티 하위)
INSERT IGNORE INTO CMS_MENU (MENU_ID, UPPER_MENU_ID, MENU_NM, MENU_TY_CODE, EXPSR_ORDR, USE_AT, CONECT_URL) VALUES
('MENU_000000000000010', 'MENU_000000000000002', '공지사항', 'BOARD', 1, 'Y', '/view/board/notice'),
('MENU_000000000000011', 'MENU_000000000000002', '자유게시판', 'BOARD', 2, 'Y', '/view/board/free');

-- 서브 메뉴 (고객지원 하위)
INSERT IGNORE INTO CMS_MENU (MENU_ID, UPPER_MENU_ID, MENU_NM, MENU_TY_CODE, EXPSR_ORDR, USE_AT, CONECT_URL) VALUES
('MENU_000000000000020', 'MENU_000000000000004', 'FAQ', 'HTML', 1, 'Y', '/view/support/faq'),
('MENU_000000000000021', 'MENU_000000000000004', 'Q&A', 'BOARD', 2, 'Y', '/view/support/qna');
