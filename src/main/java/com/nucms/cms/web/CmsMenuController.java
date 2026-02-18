package com.nucms.cms.web;

import com.nucms.cms.model.CmsMenuVO;
import com.nucms.cms.service.CmsMenuService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 메뉴 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/menu")
@RequiredArgsConstructor
public class CmsMenuController {

    private final CmsMenuService menuService;

    /** 메뉴 목록 조회 */
    @GetMapping
    public CommonResponseDTO<List<CmsMenuVO>> getList(CmsMenuVO vo) {
        List<CmsMenuVO> list = menuService.getCmsMenuList(vo);
        return CommonResponseDTO.success(list);
    }

    /** 메뉴 상세 조회 */
    @GetMapping("/{id}")
    public CommonResponseDTO<CmsMenuVO> getDetail(@PathVariable("id") String id) {
        CmsMenuVO menu = menuService.getCmsMenu(id);
        if (menu == null) {
            return CommonResponseDTO.error("존재하지 않는 메뉴입니다.");
        }
        return CommonResponseDTO.success(menu);
    }

    /** 메뉴 등록 */
    @PostMapping
    public CommonResponseDTO<String> regist(@RequestBody CmsMenuVO vo) {
        menuService.registCmsMenu(vo);
        return CommonResponseDTO.success("등록되었습니다.", vo.getMenuId());
    }

    /** 메뉴 수정 */
    @PutMapping("/{id}")
    public CommonResponseDTO<String> update(@PathVariable("id") String id, @RequestBody CmsMenuVO vo) {
        vo.setMenuId(id);
        menuService.updateCmsMenu(vo);
        return CommonResponseDTO.success("수정되었습니다.", id);
    }

    /** 메뉴 벌크 업데이트 (드래그 & 드롭) */
    @PutMapping("/batch-update")
    public CommonResponseDTO<String> updateBatch(@RequestBody List<CmsMenuVO> menuList) {
        menuService.updateCmsMenuBatch(menuList);
        return CommonResponseDTO.success("메뉴 구조가 저장되었습니다.");
    }

    /** 메뉴 삭제 */
    @DeleteMapping("/{id}")
    public CommonResponseDTO<String> delete(@PathVariable("id") String id) {
        menuService.deleteCmsMenu(id);
        return CommonResponseDTO.success("삭제되었습니다.", id);
    }
}
