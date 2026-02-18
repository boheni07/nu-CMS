package com.nucms.cms.web;

import com.nucms.cms.model.CmsBoardPostVO;
import com.nucms.cms.service.CmsBoardService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 외부 시스템 연동용 Headless API 컨트롤러 (JSON 전용)
 */
@RestController
@RequestMapping("/api/headless")
@RequiredArgsConstructor
public class CmsHeadlessController {

    private final CmsBoardService boardService;

    /** 특정 게시판의 콘텐츠를 JSON 형태로 외부 제공 */
    @GetMapping("/board/{bbsId}")
    public CommonResponseDTO<List<CmsBoardPostVO>> getBoardContent(@PathVariable("bbsId") String bbsId) {
        CmsBoardPostVO vo = new CmsBoardPostVO();
        vo.setBbsId(bbsId);
        return CommonResponseDTO.success(boardService.getBoardPostList(vo));
    }

    /** 전역 콘텐츠 검색 API (Headless 제공용) */
    @GetMapping("/search")
    public CommonResponseDTO<List<CmsBoardPostVO>> searchContent(@RequestParam("q") String query) {
        return CommonResponseDTO.success(boardService.searchGlobal(query));
    }
}
