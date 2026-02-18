package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsWidgetVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * CMS 위젯 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsWidgetMapper {

    /** 위젯 상세 조회 */
    CmsWidgetVO selectCmsWidget(String widgetId);

    /** 위젯 목록 조회 */
    List<CmsWidgetVO> selectCmsWidgetList(CmsWidgetVO vo);

    /** 위젯 등록 */
    int insertCmsWidget(CmsWidgetVO vo);

    /** 위젯 수정 */
    int updateCmsWidget(CmsWidgetVO vo);

    /** 위젯 삭제 */
    int deleteCmsWidget(String widgetId);
}
