package com.nucms.cms.service;

import com.nucms.cms.model.CmsMenuVO;
import java.util.List;

/**
 * CMS 메뉴 관리 서비스 인터페이스
 */
public interface CmsMenuService {

    /** 메뉴 상세 조회 */
    CmsMenuVO getCmsMenu(String menuId);

    /** 메뉴 목록 조회 */
    List<CmsMenuVO> getCmsMenuList(CmsMenuVO vo);

    /** 메뉴 등록 */
    void registCmsMenu(CmsMenuVO vo);

    /** 메뉴 수정 */
    void updateCmsMenu(CmsMenuVO vo);

    /** 메뉴 벌크 업데이트 (드래그 & 드롭 순서 저장) */
    void updateCmsMenuBatch(List<CmsMenuVO> menuList);

    /** 메뉴 삭제 */
    void deleteCmsMenu(String menuId);
}
