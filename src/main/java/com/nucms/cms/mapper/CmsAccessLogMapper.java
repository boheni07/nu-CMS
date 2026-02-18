package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsAccessLogVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * CMS 접속 및 감사 로그 Mapper 인터페이스
 */
@Mapper
public interface CmsAccessLogMapper {

    /** 감사 로그 목록 조회 (검색 포함) */
    List<CmsAccessLogVO> selectAccessLogList(CmsAccessLogVO vo);

    /** 감사 로그 단건 등록 (AOP 등에서 호출) */
    int insertAccessLog(CmsAccessLogVO vo);

    /** 로그 상세 조회 */
    CmsAccessLogVO selectAccessLog(Long logId);
}
