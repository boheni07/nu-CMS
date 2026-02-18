package com.nucms.cms.web;

import com.nucms.cms.model.CmsRoleVO;
import com.nucms.cms.service.CmsRoleService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 역할 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/role")
@RequiredArgsConstructor
public class CmsRoleController {

    private final CmsRoleService roleService;

    /** 역할 목록 조회 */
    @GetMapping
    public CommonResponseDTO<List<CmsRoleVO>> getList(CmsRoleVO vo) {
        return CommonResponseDTO.success(roleService.getCmsRoleList(vo));
    }

    /** 역할 상세 조회 */
    @GetMapping("/{roleCode}")
    public CommonResponseDTO<CmsRoleVO> getDetail(@PathVariable("roleCode") String roleCode) {
        return CommonResponseDTO.success(roleService.getCmsRole(roleCode));
    }

    /** 역할 등록 */
    @PostMapping
    public CommonResponseDTO<String> regist(@RequestBody CmsRoleVO vo) {
        roleService.registCmsRole(vo);
        return CommonResponseDTO.success("역할이 등록되었습니다.");
    }

    /** 역할 수정 */
    @PutMapping("/{roleCode}")
    public CommonResponseDTO<String> update(@PathVariable("roleCode") String roleCode, @RequestBody CmsRoleVO vo) {
        vo.setRoleCode(roleCode);
        roleService.modifyCmsRole(vo);
        return CommonResponseDTO.success("역할 정보가 수정되었습니다.");
    }

    /** 역할 삭제 */
    @DeleteMapping("/{roleCode}")
    public CommonResponseDTO<String> delete(@PathVariable("roleCode") String roleCode) {
        roleService.removeCmsRole(roleCode);
        return CommonResponseDTO.success("역할이 삭제되었습니다.");
    }

    /** 역할별 메뉴 권한 저장 */
    @PostMapping("/{roleCode}/menus")
    public CommonResponseDTO<String> saveMenuRole(@PathVariable("roleCode") String roleCode, @RequestBody List<String> menuIds) {
        roleService.saveMenuRole(roleCode, menuIds);
        return CommonResponseDTO.success("메뉴 권한이 저장되었습니다.");
    }

    /** 특정 역할의 접근 가능 메뉴 ID 목록 조회 */
    @GetMapping("/{roleCode}/menus")
    public CommonResponseDTO<List<String>> getRoleMenus(@PathVariable("roleCode") String roleCode) {
        return CommonResponseDTO.success(roleService.getRoleMenuIds(roleCode));
    }
}
