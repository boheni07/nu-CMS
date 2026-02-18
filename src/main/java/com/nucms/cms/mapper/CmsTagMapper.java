package com.nucms.cms.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

/**
 * CMS 태그 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsTagMapper {
    List<Map<String, Object>> selectTagListByContentId(String cntentsId);
    int insertTag(Map<String, Object> param);
    int deleteTagMapByContentId(String cntentsId);
    int insertContentTagMap(Map<String, Object> param);
}
