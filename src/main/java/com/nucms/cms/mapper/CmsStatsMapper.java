package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsStatsVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CmsStatsMapper {

    /** PV 등록 */
    void insertPv(CmsStatsVO vo);

    /** 일별 접속 통계 (PV/UV) */
    List<CmsStatsVO> selectDailyStats(CmsStatsVO vo);

    /** 메뉴별 접속 통계 (Top N) */
    List<CmsStatsVO> selectMenuStats(CmsStatsVO vo);
}
