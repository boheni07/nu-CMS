package com.nucms.cms.service;

import com.nucms.cms.model.CmsStatsVO;
import java.util.List;

public interface CmsStatsService {
    
    /** PV 로그 기록 */
    void logPv(String url, String ip, String referer, String userId);

    /** 일별 통계 조회 */
    List<CmsStatsVO> getDailyStats(String startDate, String endDate);

    /** 메뉴별 통계 조회 */
    List<CmsStatsVO> getMenuStats(String startDate, String endDate);
}
