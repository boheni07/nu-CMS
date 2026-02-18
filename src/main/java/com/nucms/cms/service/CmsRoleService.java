package com.nucms.cms.service;

import com.nucms.cms.model.CmsRoleVO;
import java.util.List;

/**
 * CMS 역할 관리 서비스 인터페이스
 */
public interface CmsRoleService {

    /** 역할 상세 조회 */
    CmsRoleVO getCmsRole(String roleCode);

    /** 역할 목록 조회 */
    List<CmsRoleVO> getCmsRoleList(CmsRoleVO vo);

    /** 역할 등록 */
    void registCmsRole(CmsRoleVO vo);

    /** 역할 수정 */
    void modifyCmsRole(CmsRoleVO vo);

    /** 역할 삭제 */
    void removeCmsRole(String roleCode);

    /** 특정 역할의 메뉴 접근 권한 저장 */
    void saveMenuRole(String roleCode, List<String> menuIds);

    /** 특정 역할의 메뉴 ID 목록 조회 */
    List<String> getRoleMenuIds(String roleCode);
}
