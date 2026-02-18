package com.nucms.cms.web;

import com.nucms.cms.service.CmsCategoryService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * CMS 카테고리 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/category")
@RequiredArgsConstructor
public class CmsCategoryController {

    private final CmsCategoryService categoryService;

    /** 카테고리 목록 조회 */
    @GetMapping
    public CommonResponseDTO<List<Map<String, Object>>> getList() {
        return CommonResponseDTO.success(categoryService.getCategoryList());
    }

    /** 카테고리 등록 */
    @PostMapping
    public CommonResponseDTO<String> regist(@RequestBody Map<String, Object> param) {
        categoryService.registCategory(param);
        return CommonResponseDTO.success("카테고리가 등록되었습니다.");
    }

    /** 카테고리 수정 */
    @PutMapping("/{id}")
    public CommonResponseDTO<String> modify(@PathVariable("id") String id, @RequestBody Map<String, Object> param) {
        param.put("ctgryId", id);
        categoryService.modifyCategory(param);
        return CommonResponseDTO.success("카테고리가 수정되었습니다.");
    }

    /** 카테고리 삭제 */
    @DeleteMapping("/{id}")
    public CommonResponseDTO<String> remove(@PathVariable("id") String id) {
        categoryService.removeCategory(id);
        return CommonResponseDTO.success("카테고리가 삭제되었습니다.");
    }
}
