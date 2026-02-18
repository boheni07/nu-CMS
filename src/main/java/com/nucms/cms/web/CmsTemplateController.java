package com.nucms.cms.web;

import com.nucms.cms.model.CmsTemplateVO;
import com.nucms.cms.service.CmsTemplateService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 템플릿 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/template")
@RequiredArgsConstructor
public class CmsTemplateController {

    private final CmsTemplateService templateService;

    /** 템플릿 목록 조회 */
    @GetMapping
    public CommonResponseDTO<List<CmsTemplateVO>> getList(CmsTemplateVO vo) {
        List<CmsTemplateVO> list = templateService.getCmsTemplateList(vo);
        return CommonResponseDTO.success(list);
    }

    /** 템플릿 상세 조회 */
    @GetMapping("/{id}")
    public CommonResponseDTO<CmsTemplateVO> getDetail(@PathVariable("id") String id) {
        CmsTemplateVO template = templateService.getCmsTemplate(id);
        if (template == null) {
            return CommonResponseDTO.error("존재하지 않는 템플릿입니다.");
        }
        return CommonResponseDTO.success(template);
    }

    /** 템플릿 등록 */
    @PostMapping
    public CommonResponseDTO<String> regist(@RequestBody CmsTemplateVO vo) {
        templateService.registCmsTemplate(vo);
        return CommonResponseDTO.success("등록되었습니다.", vo.getTmplatId());
    }

    /** 템플릿 수정 */
    @PutMapping("/{id}")
    public CommonResponseDTO<String> update(@PathVariable("id") String id, @RequestBody CmsTemplateVO vo) {
        vo.setTmplatId(id);
        templateService.updateCmsTemplate(vo);
        return CommonResponseDTO.success("수정되었습니다.", id);
    }

    /** 템플릿 삭제 */
    @DeleteMapping("/{id}")
    public CommonResponseDTO<String> delete(@PathVariable("id") String id) {
        templateService.deleteCmsTemplate(id);
        return CommonResponseDTO.success("삭제되었습니다.", id);
    }
}
