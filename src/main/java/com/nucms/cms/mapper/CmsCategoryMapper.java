package com.nucms.cms.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

/**
 * CMS 카테고리 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsCategoryMapper {
    List<Map<String, Object>> selectCategoryList();
    int insertCategory(Map<String, Object> param);
    int updateCategory(Map<String, Object> param);
    int deleteCategory(String ctgryId);
}
