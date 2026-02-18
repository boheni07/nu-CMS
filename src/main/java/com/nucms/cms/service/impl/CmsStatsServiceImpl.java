package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsStatsMapper;
import com.nucms.cms.model.CmsStatsVO;
import com.nucms.cms.service.CmsStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CmsStatsServiceImpl implements CmsStatsService {

    private final CmsStatsMapper statsMapper;

    @Override
    @Transactional
    public void logPv(String url, String ip, String referer, String userId) {
        CmsStatsVO vo = new CmsStatsVO();
        vo.setConectUrl(url);
        vo.setConectIp(ip);
        vo.setRefererUrl(referer);
        vo.setEsntlId(userId);
        statsMapper.insertPv(vo);
    }

    @Override
    public List<CmsStatsVO> getDailyStats(String startDate, String endDate) {
        CmsStatsVO vo = new CmsStatsVO();
        vo.setStartDate(startDate != null ? startDate : LocalDate.now().minusDays(30).format(DateTimeFormatter.BASIC_ISO_DATE));
        vo.setEndDate(endDate != null ? endDate : LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE));
        return statsMapper.selectDailyStats(vo);
    }

    @Override
    public List<CmsStatsVO> getMenuStats(String startDate, String endDate) {
        CmsStatsVO vo = new CmsStatsVO();
        vo.setStartDate(startDate != null ? startDate : LocalDate.now().minusDays(30).format(DateTimeFormatter.BASIC_ISO_DATE));
        vo.setEndDate(endDate != null ? endDate : LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE));
        return statsMapper.selectMenuStats(vo);
    }
}
