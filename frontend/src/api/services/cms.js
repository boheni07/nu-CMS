import axios from '../axios';

/**
 * CMS 관리자 기능 통합 API 서비스
 * 각 도메인별(Member, Role, Board 등)로 메서드를 그룹화하여 제공
 * 응답 데이터의 Null Safety를 보장하도록 처리
 */
const CmsService = {
    // =========================================================================
    // 1. 회원 관리 (Member)
    // =========================================================================
    member: {
        /** 회원 목록 조회 */
        getList: async () => {
            try {
                const response = await axios.get('/cms/member');
                return response.data.success ? (response.data.data || []) : [];
            } catch (error) {
                console.error('Member List Fetch Error:', error);
                throw error;
            }
        },

        /** 특정 회원 상세 조회 (권한 정보 포함) */
        getDetail: async (esntlId) => {
            try {
                const response = await axios.get(`/cms/member/${esntlId}`);
                return response.data.success ? response.data.data : null;
            } catch (error) {
                console.error('Member Detail Fetch Error:', error);
                throw error;
            }
        },

        /** 회원 상태 변경 (정상, 정지 등) */
        updateStatus: async (esntlId, status) => {
            return await axios.patch(`/cms/member/${esntlId}/status?status=${status}`);
        },

        /** 회원 권한(Role) 저장 */
        saveRoles: async (esntlId, roleCodes) => {
            return await axios.post(`/cms/member/${esntlId}/roles`, roleCodes);
        },

        /** 회원 등록 */
        regist: async (data) => {
            return await axios.post('/cms/member', data);
        },

        /** 회원 정보 수정 */
        update: async (esntlId, data) => {
            return await axios.put(`/cms/member/${esntlId}`, data);
        }
    },

    // =========================================================================
    // 2. 역할 관리 (Role)
    // =========================================================================
    role: {
        /** 역할 목록 조회 */
        getList: async () => {
            try {
                const response = await axios.get('/cms/role');
                return response.data.success ? (response.data.data || []) : [];
            } catch (error) {
                console.error('Role List Fetch Error:', error);
                throw error;
            }
        },

        /** 메뉴 트리 조회 (권한 설정용) */
        getMenuTree: async () => {
            try {
                const response = await axios.get('/cms/menu-tree');
                return response.data.success ? (response.data.data || []) : [];
            } catch (error) {
                console.error('Menu Tree Fetch Error:', error);
                throw error;
            }
        },

        /** 특정 역할의 메뉴 권한 조회 */
        getRoleMenus: async (roleCode) => {
            try {
                const response = await axios.get(`/cms/role/${roleCode}/menus`);
                return response.data.success ? (response.data.data || []) : [];
            } catch (error) {
                console.error('Role Menu Fetch Error:', error);
                throw error;
            }
        },

        /** 역할의 메뉴 권한 저장 */
        saveRoleMenus: async (roleCode, menuIds) => {
            return await axios.post(`/cms/role/${roleCode}/menus`, menuIds);
        },

        /** 역할 생성 */
        create: async (data) => {
            return await axios.post('/cms/role', data);
        },

        /** 역할 수정 */
        update: async (roleCode, data) => {
            return await axios.put(`/cms/role/${roleCode}`, data);
        }
    },

    // =========================================================================
    // 3. 게시판 관리 (Board)
    // =========================================================================
    board: {
        /** 게시판 마스터 목록 조회 */
        getMasterList: async () => {
            try {
                const response = await axios.get('/cms/board/master');
                return response.data.success ? (response.data.data || []) : [];
            } catch (error) {
                console.error('Board Master List Fetch Error:', error);
                throw error;
            }
        },

        /** 게시판 마스터 생성 */
        createMaster: async (data) => {
            return await axios.post('/cms/board/master', data);
        },

        /** 게시판 마스터 수정 */
        updateMaster: async (bbsId, data) => {
            return await axios.put(`/cms/board/master/${bbsId}`, data);
        },

        /** 게시판 마스터 삭제 */
        deleteMaster: async (bbsId) => {
            return await axios.delete(`/cms/board/master/${bbsId}`);
        },

        // =========================================================================
        // 4. 게시물 관리 (Article)
        // =========================================================================
        article: {
            /** 게시물 목록 조회 */
            getList: async (bbsId, params) => {
                try {
                    // Controller: @GetMapping("/{bbsId}/posts")
                    const response = await axios.get(`/cms/board/${bbsId}/posts`, { params });
                    return response.data.success ? response.data.data : [];
                } catch (error) {
                    console.error('Article List Fetch Error:', error);
                    throw error;
                }
            },

            /** 게시물 상세 조회 */
            getDetail: async (bbsId, nttId) => {
                try {
                    // Controller: @GetMapping("/post/{nttId}")
                    const response = await axios.get(`/cms/board/post/${nttId}`);
                    return response.data.success ? response.data.data : null;
                } catch (error) {
                    console.error('Article Detail Fetch Error:', error);
                    throw error;
                }
            },

            /** 게시물 등록 */
            create: async (bbsId, data) => {
                // Controller: @PostMapping("/post")
                return await axios.post('/cms/board/post', { ...data, bbsId });
            },

            /** 게시물 수정 */
            update: async (bbsId, nttId, data) => {
                // Controller: @PutMapping("/post")
                // nttId와 bbsId를 body에 포함
                return await axios.put('/cms/board/post', { ...data, nttId, bbsId });
            },

            /** 게시물 삭제 */
            delete: async (bbsId, nttId) => {
                // Controller: @DeleteMapping("/post/{nttId}")
                return await axios.delete(`/cms/board/post/${nttId}`);
            }
        }
    },

    // =========================================================================
    // 5. 위젯 관리 (Widget)
    // =========================================================================
    widget: {
        /** 위젯 목록 조회 */
        getList: async () => {
            try {
                const response = await axios.get('/cms/widget');
                return response.data.success ? (response.data.data || []) : [];
            } catch (error) {
                console.error('Widget List Fetch Error:', error);
                throw error;
            }
        },

        /** 위젯 상세 조회 */
        getDetail: async (widgetId) => {
            try {
                const response = await axios.get(`/cms/widget/${widgetId}`);
                return response.data.success ? response.data.data : null;
            } catch (error) {
                console.error('Widget Detail Fetch Error:', error);
                throw error;
            }
        },

        /** 위젯 생성 */
        create: async (data) => {
            return await axios.post('/cms/widget', data);
        },

        /** 위젯 수정 */
        update: async (widgetId, data) => {
            return await axios.put(`/cms/widget/${widgetId}`, data);
        },

        /** 위젯 삭제 */
        delete: async (widgetId) => {
            return await axios.delete(`/cms/widget/${widgetId}`);
        }
    }
};

export default CmsService;
