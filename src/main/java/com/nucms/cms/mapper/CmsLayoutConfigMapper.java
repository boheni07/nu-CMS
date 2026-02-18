package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsLayoutConfigVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * CMS 레이아웃 설정 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsLayoutConfigMapper {

    /** 특정 템플릿의 전체 레이아웃 설정 조회 */
    List<CmsLayoutConfigVO> selectLayoutConfigList(String tmplatId);

    /** 레이아웃 설정 등록 */
    int insertLayoutConfig(CmsLayoutConfigVO vo);

    /** 특정 템플릿의 레이아웃 설정 전체 삭제 (일괄 업데이트 전처리용) */
    int deleteLayoutConfigByTmplat(String tmplatId);
}
