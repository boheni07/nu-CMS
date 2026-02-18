package com.nucms.cms.web;

import com.nucms.cms.model.CmsConfigVO;
import com.nucms.cms.service.CmsConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cms/config")
@RequiredArgsConstructor
public class CmsConfigController {

    private final CmsConfigService configService;

    /**
     * 전체 설정 목록 조회
     */
    @GetMapping
    public ResponseEntity<?> getConfigList() {
        try {
            List<CmsConfigVO> list = configService.selectConfigList(new CmsConfigVO());
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", list);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "설정 조회 실패"));
        }
    }

    /**
     * 설정 일괄 수정
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveConfigs(@RequestBody Map<String, String> configMap) {
        try {
            configService.updateConfigs(configMap);
            return ResponseEntity.ok(Map.of("success", true, "message", "설정이 저장되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "설정 저장 실패"));
        }
    }
    
    /**
     * 특정 설정값 조회 (Public용, 예를 들어 로그인 페이지 등에서 사이트 제목 필요 시)
     */
    @GetMapping("/{key}")
    public ResponseEntity<?> getConfigValue(@PathVariable String key) {
        try {
            String val = configService.getConfigValue(key);
            return ResponseEntity.ok(Map.of("success", true, "data", val));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "설정 조회 실패"));
        }
    }
}
