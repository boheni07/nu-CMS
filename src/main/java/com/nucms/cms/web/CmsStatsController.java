package com.nucms.cms.web;

import com.nucms.cms.service.CmsStatsService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * CMS 통계 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/stats")
@RequiredArgsConstructor
public class CmsStatsController {

    private final CmsStatsService statsService;

    /** 대시보드용 요약 통계 조회 */
    @GetMapping("/summary")
    public CommonResponseDTO<Map<String, Object>> getSummary(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        return CommonResponseDTO.success(statsService.getSummaryStats(startDate, endDate));
    }
}
