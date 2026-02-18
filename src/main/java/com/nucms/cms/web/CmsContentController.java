package com.nucms.cms.web;

import com.nucms.cms.model.CmsContentVO;
import com.nucms.cms.service.CmsContentService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 콘텐츠 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/content")
@RequiredArgsConstructor
public class CmsContentController {

    private final CmsContentService contentService;

    @GetMapping
    public CommonResponseDTO<List<CmsContentVO>> getList(@ModelAttribute CmsContentVO vo) {
        try {
            List<CmsContentVO> list = contentService.getCmsContentList(vo);
            return CommonResponseDTO.success(list);
        } catch (Exception e) {
            e.printStackTrace();
            return CommonResponseDTO.error("서버 에러: " + e.getMessage());
        }
    }

    /** 콘텐츠 상세 조회 */
    @GetMapping("/{id}")
    public CommonResponseDTO<CmsContentVO> getDetail(@PathVariable("id") String id) {
        CmsContentVO content = contentService.getCmsContent(id);
        if (content == null) {
            return CommonResponseDTO.error("존재하지 않는 콘텐츠입니다.");
        }
        return CommonResponseDTO.success(content);
    }

    /** 콘텐츠 버전 이력 조회 */
    @GetMapping("/{id}/history")
    public CommonResponseDTO<List<java.util.Map<String, Object>>> getHistory(@PathVariable("id") String id) {
        List<java.util.Map<String, Object>> history = contentService.getCmsContentHistList(id);
        return CommonResponseDTO.success(history);
    }

    /** 콘텐츠 특정 버전으로 롤백 */
    @PostMapping("/{id}/rollback/{histId}")
    public CommonResponseDTO<String> rollback(@PathVariable("id") String id, @PathVariable("histId") Long histId) {
        contentService.rollbackCmsContent(id, histId);
        return CommonResponseDTO.success("롤백되었습니다.", id);
    }

    /** 콘텐츠 등록 */
    @PostMapping
    public CommonResponseDTO<String> regist(@RequestBody CmsContentVO vo) {
        contentService.registCmsContent(vo);
        return CommonResponseDTO.success("등록되었습니다.", vo.getCntentsId());
    }

    /** 콘텐츠 수정 (버전 관리 포함) */
    @PutMapping("/{id}")
    public CommonResponseDTO<String> update(@PathVariable("id") String id, @RequestBody CmsContentVO vo) {
        vo.setCntentsId(id);
        contentService.updateCmsContent(vo);
        return CommonResponseDTO.success("수정 및 아카이빙이 완료되었습니다.", id);
    }

    /** 콘텐츠 삭제 */
    @DeleteMapping("/{id}")
    public CommonResponseDTO<String> delete(@PathVariable("id") String id) {
        contentService.deleteCmsContent(id);
        return CommonResponseDTO.success("삭제되었습니다.", id);
    }
}
