package com.nucms.cms.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.Map;

/**
 * CMS 워크플로우 로그 Mapper 인터페이스
 */
@Mapper
public interface CmsWorkflowLogMapper {

    /** 워크플로우 로그 등록 */
    int insertWorkflowLog(Map<String, Object> param);
}
