package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsRoleVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * CMS 역할 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsRoleMapper {

    /** 역할 상세 조회 */
    CmsRoleVO selectCmsRole(String roleCode);

    /** 역할 목록 조회 */
    List<CmsRoleVO> selectCmsRoleList(CmsRoleVO vo);

    /** 역할 등록 */
    int insertCmsRole(CmsRoleVO vo);

    /** 역할 수정 */
    int updateCmsRole(CmsRoleVO vo);

    /** 역할 삭제 */
    int deleteCmsRole(String roleCode);

    /** 역할별 메뉴 권한 저장 */
    int insertMenuRole(java.util.Map<String, String> param);

    /** 역할의 모든 메뉴 권한 삭제 */
    int deleteMenuRoles(String roleCode);

    /** 특정 역할의 접근 가능 메뉴 ID 목록 조회 */
    List<String> selectRoleMenuIds(String roleCode);
}
