package com.nucms.cms.web;

import com.nucms.cms.model.CmsAccessLogVO;
import com.nucms.cms.service.CmsAccessLogService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * CMS 접속 및 감사 로그 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/access-log")
@RequiredArgsConstructor
public class CmsAccessLogController {

    private final CmsAccessLogService accessLogService;

    /** 감사 로그 목록 조회 */
    @GetMapping
    public CommonResponseDTO<List<CmsAccessLogVO>> getList(CmsAccessLogVO vo) {
        return CommonResponseDTO.success(accessLogService.getAccessLogList(vo));
    }
}
