package com.nucms.cms.service;

import com.nucms.cms.model.CmsWidgetVO;
import java.util.List;

/**
 * CMS 위젯 관리 서비스 인터페이스
 */
public interface CmsWidgetService {

    /** 위젯 상세 조회 */
    CmsWidgetVO getCmsWidget(String widgetId);

    /** 위젯 목록 조회 */
    List<CmsWidgetVO> getCmsWidgetList(CmsWidgetVO vo);

    /** 위젯 등록 */
    void registCmsWidget(CmsWidgetVO vo);

    /** 위젯 수정 */
    void modifyCmsWidget(CmsWidgetVO vo);

    /** 위젯 삭제 */
    void removeCmsWidget(String widgetId);
}
