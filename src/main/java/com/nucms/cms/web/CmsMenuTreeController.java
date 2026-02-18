package com.nucms.cms.web;

import com.nucms.cms.model.CmsMenuVO;
import com.nucms.cms.service.CmsMenuTreeService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 메뉴 트리 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/menu-tree")
@RequiredArgsConstructor
public class CmsMenuTreeController {

    private final CmsMenuTreeService menuTreeService;

    /** 메뉴 트리 전체 조회 */
    @GetMapping
    public CommonResponseDTO<List<CmsMenuVO>> getTree() throws Exception {
        return CommonResponseDTO.success(menuTreeService.getMenuTree());
    }

    /** 메뉴 트리 구조 일괄 저장 (드래그 앤 드롭 결과 반영) */
    @PostMapping("/save")
    public CommonResponseDTO<String> saveTree(@RequestBody List<CmsMenuVO> menuList) throws Exception {
        menuTreeService.saveMenuTree(menuList);
        return CommonResponseDTO.success("메뉴 구조가 저장되었습니다.");
    }
}
