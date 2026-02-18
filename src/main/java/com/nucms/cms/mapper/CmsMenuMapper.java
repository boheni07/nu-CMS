package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsMenuVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * CMS 메뉴 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsMenuMapper {

    /** 메뉴 상세 조회 */
    CmsMenuVO selectCmsMenu(String menuId);

    /** 메뉴 목록 조회 */
    List<CmsMenuVO> selectCmsMenuList(CmsMenuVO vo);

    /** 메뉴 등록 */
    int insertCmsMenu(CmsMenuVO vo);

    /** 메뉴 수정 */
    int updateCmsMenu(CmsMenuVO vo);

    /** 메뉴 삭제 */
    int deleteCmsMenu(String menuId);
}
