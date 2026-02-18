package com.nucms.cms.web;

import com.nucms.cms.model.CmsAuditLogVO;
import com.nucms.cms.service.CmsAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cms/audit-log")
@RequiredArgsConstructor
public class CmsAuditLogController {

    private final CmsAuditService auditService;

    /**
     * 로그 목록 조회
     */
    @GetMapping
    public ResponseEntity<?> getLogList(CmsAuditLogVO vo) {
        try {
            List<CmsAuditLogVO> list = auditService.selectLogList(vo);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", list);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "로그 조회 실패"));
        }
    }
    
    /**
     * 로그 상세 조회
     */
    @GetMapping("/{logId}")
    public ResponseEntity<?> getLogDetail(@PathVariable int logId) {
        try {
            CmsAuditLogVO vo = new CmsAuditLogVO();
            vo.setLogId(logId);
            CmsAuditLogVO result = auditService.selectLog(vo);
            return ResponseEntity.ok(Map.of("success", true, "data", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "로그 상세 조회 실패"));
        }
    }
}
