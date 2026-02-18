package com.nucms.cms.service;

import java.util.List;
import java.util.Map;

/**
 * CMS 태그 관리 서비스 인터페이스
 */
public interface CmsTagService {
    List<Map<String, Object>> getTagListByContentId(String cntentsId);
    void saveTags(String cntentsId, List<String> tags);
}
