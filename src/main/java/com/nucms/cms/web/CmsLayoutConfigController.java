package com.nucms.cms.web;

import com.nucms.cms.model.CmsLayoutConfigVO;
import com.nucms.cms.service.CmsLayoutConfigService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 레이아웃 설정 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/layout-config")
@RequiredArgsConstructor
public class CmsLayoutConfigController {

    private final CmsLayoutConfigService layoutConfigService;

    /** 특정 템플릿의 레이아웃 설정 목록 조회 */
    @GetMapping("/{tmplatId}")
    public CommonResponseDTO<List<CmsLayoutConfigVO>> getList(@PathVariable("tmplatId") String tmplatId) {
        return CommonResponseDTO.success(layoutConfigService.getLayoutConfigList(tmplatId));
    }

    /** 특정 템플릿의 레이아웃 설정 일괄 저장 */
    @PostMapping("/{tmplatId}/save")
    public CommonResponseDTO<String> save(@PathVariable("tmplatId") String tmplatId, @RequestBody List<CmsLayoutConfigVO> configList) throws Exception {
        layoutConfigService.saveLayoutConfig(tmplatId, configList);
        return CommonResponseDTO.success("레이아웃 설정이 저장되었습니다.");
    }
}
