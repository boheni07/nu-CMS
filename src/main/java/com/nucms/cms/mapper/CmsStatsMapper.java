package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsStatsVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * CMS 통계 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsStatsMapper {

    /** 페이지뷰 로그 기록 */
    void insertPvLog(CmsStatsVO vo);

    /** 일별 방문자 추이 조회 (날짜별 PV) */
    List<CmsStatsVO> selectDailyPvStats(Map<String, Object> param);

    /** 인기 콘텐츠 순위 조회 (TOP 10) */
    List<CmsStatsVO> selectPopularContentStats(int limit);

    /** 기기별/유입경로별 통계 (간이 분석) */
    List<CmsStatsVO> selectRefererStats();
}
