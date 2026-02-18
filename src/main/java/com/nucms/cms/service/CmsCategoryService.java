package com.nucms.cms.service;

import java.util.List;
import java.util.Map;

/**
 * CMS 카테고리 관리 서비스 인터페이스
 */
public interface CmsCategoryService {
    List<Map<String, Object>> getCategoryList();
    void registCategory(Map<String, Object> param);
    void modifyCategory(Map<String, Object> param);
    void removeCategory(String ctgryId);
}
