package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsStatsMapper;
import com.nucms.cms.model.CmsStatsVO;
import com.nucms.cms.service.CmsStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CMS 통계 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsStatsServiceImpl implements CmsStatsService {

    private final CmsStatsMapper statsMapper;

    @Override
    public void addPvLog(CmsStatsVO vo) {
        if (vo.getConectDe() == null) {
            vo.setConectDe(java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE));
        }
        statsMapper.insertPvLog(vo);
    }

    @Override
    public Map<String, Object> getSummaryStats(String startDate, String endDate) {
        Map<String, Object> result = new HashMap<>();
        
        Map<String, Object> param = new HashMap<>();
        param.put("startDate", startDate);
        param.put("endDate", endDate);

        // 1. 일별 PV 추이
        result.put("dailyPv", statsMapper.selectDailyPvStats(param));
        
        // 2. 인기 콘텐츠 (URL 기준)
        result.put("popularContent", statsMapper.selectPopularContentStats(10));
        
        // 3. 유입경로 비중
        result.put("refererStats", statsMapper.selectRefererStats());

        return result;
    }
}
