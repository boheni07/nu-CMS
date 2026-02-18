package com.nucms.cms.web;

import com.nucms.cms.model.CmsWidgetVO;
import com.nucms.cms.service.CmsWidgetService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 위젯 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/widget")
@RequiredArgsConstructor
public class CmsWidgetController {

    private final CmsWidgetService widgetService;

    /** 위젯 목록 조회 */
    @GetMapping
    public CommonResponseDTO<List<CmsWidgetVO>> getList(CmsWidgetVO vo) {
        try {
            return CommonResponseDTO.success(widgetService.getCmsWidgetList(vo));
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 에러 로그 출력
            throw e; // GlobalExceptionHandler로 전달
        }
    }

    /** 위젯 상세 조회 */
    @GetMapping("/{id}")
    public CommonResponseDTO<CmsWidgetVO> getDetail(@PathVariable("id") String id) {
        return CommonResponseDTO.success(widgetService.getCmsWidget(id));
    }

    /** 위젯 등록 */
    @PostMapping
    public CommonResponseDTO<String> regist(@RequestBody CmsWidgetVO vo) {
        widgetService.registCmsWidget(vo);
        return CommonResponseDTO.success("위젯이 등록되었습니다.");
    }

    /** 위젯 수정 */
    @PutMapping("/{id}")
    public CommonResponseDTO<String> update(@PathVariable("id") String id, @RequestBody CmsWidgetVO vo) {
        vo.setWidgetId(id);
        widgetService.modifyCmsWidget(vo);
        return CommonResponseDTO.success("위젯이 수정되었습니다.");
    }

    /** 위젯 삭제 */
    @DeleteMapping("/{id}")
    public CommonResponseDTO<String> delete(@PathVariable("id") String id) {
        widgetService.removeCmsWidget(id);
        return CommonResponseDTO.success("위젯이 삭제되었습니다.");
    }
}
