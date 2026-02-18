package com.nucms.cms.service;

import com.nucms.cms.model.CmsMenuVO;
import java.util.List;

/**
 * CMS 메뉴 트리 관리 서비스 인터페이스
 */
public interface CmsMenuTreeService {

    /**
     * 메뉴 트리 구조 일괄 저장
     * @param menuList 변경된 메뉴 목록
     */
    void saveMenuTree(List<CmsMenuVO> menuList) throws Exception;

    /**
     * 트리 구조로 메뉴 목록 조회
     * @return 트리형 메뉴 리스트
     */
    List<CmsMenuVO> getMenuTree() throws Exception;
}
