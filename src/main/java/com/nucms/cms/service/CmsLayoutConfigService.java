package com.nucms.cms.service;

import com.nucms.cms.model.CmsLayoutConfigVO;
import java.util.List;

/**
 * CMS 레이아웃 설정 관리 서비스 인터페이스
 */
public interface CmsLayoutConfigService {

    /** 특정 템플릿의 레이아웃 설정 목록 조회 */
    List<CmsLayoutConfigVO> getLayoutConfigList(String tmplatId);

    /** 특정 템플릿의 레이아웃 설정 일괄 저장 */
    void saveLayoutConfig(String tmplatId, List<CmsLayoutConfigVO> configList) throws Exception;
}
