package com.nucms.cms.web;

import com.nucms.cms.model.CmsStatsVO;
import com.nucms.cms.service.CmsStatsService;
import com.nucms.common.model.CommonResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cms/stats")
@RequiredArgsConstructor
public class CmsStatsController {

    private final CmsStatsService statsService;

    /** PV 로깅 (프론트엔드 호출) */
    @PostMapping("/pv")
    public CommonResponseDTO<Void> logPv(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String url = payload.get("url");
        String referer = payload.get("referer");
        String ip = request.getRemoteAddr();
        
        String userId = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            userId = auth.getName();
        }

        statsService.logPv(url, ip, referer, userId);
        return CommonResponseDTO.success(null);
    }

    /** 일별 통계 조회 */
    @GetMapping("/daily")
    public CommonResponseDTO<List<CmsStatsVO>> getDailyStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return CommonResponseDTO.success(statsService.getDailyStats(startDate, endDate));
    }

    /** 메뉴별 통계 조회 */
    @GetMapping("/menu")
    public CommonResponseDTO<List<CmsStatsVO>> getMenuStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return CommonResponseDTO.success(statsService.getMenuStats(startDate, endDate));
    }
}
