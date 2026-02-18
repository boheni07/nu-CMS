package com.nucms.cms.service;

import com.nucms.cms.model.CmsStatsVO;
import java.util.List;
import java.util.Map;

/**
 * CMS 통계 관리 서비스 인터페이스
 */
public interface CmsStatsService {

    /** 로그 기록 (PV) */
    void addPvLog(CmsStatsVO vo);

    /** 요약 통계 조회 (PV 추이, 인기 콘텐츠, 유입경로) */
    Map<String, Object> getSummaryStats(String startDate, String endDate);
}
