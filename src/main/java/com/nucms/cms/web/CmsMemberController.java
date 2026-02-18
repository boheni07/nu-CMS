package com.nucms.cms.web;

import com.nucms.cms.model.CmsMemberVO;
import com.nucms.cms.service.CmsMemberService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 회원 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/member")
@RequiredArgsConstructor
public class CmsMemberController {

    private final CmsMemberService memberService;

    /** 회원 목록 조회 */
    @GetMapping
    public CommonResponseDTO<List<CmsMemberVO>> getList(CmsMemberVO vo) {
        return CommonResponseDTO.success(memberService.getCmsMemberList(vo));
    }

    /** 회원 상세 조회 */
    @GetMapping("/{id}")
    public CommonResponseDTO<CmsMemberVO> getDetail(@PathVariable("id") String id) {
        return CommonResponseDTO.success(memberService.getCmsMember(id));
    }

    /** 회원 등록 (가입 승인 등 외부 연동 가능) */
    @PostMapping
    public CommonResponseDTO<String> regist(@RequestBody CmsMemberVO vo) {
        memberService.registCmsMember(vo);
        return CommonResponseDTO.success("회원이 등록되었습니다.");
    }

    /** 회원 정보 수정 */
    @PutMapping("/{id}")
    public CommonResponseDTO<String> update(@PathVariable("id") String id, @RequestBody CmsMemberVO vo) {
        vo.setEsntlId(id);
        memberService.modifyCmsMember(vo);
        return CommonResponseDTO.success("회원 정보가 수정되었습니다.");
    }

    /** 회원 상태 수정 (정상, 잠금, 탈퇴 등) */
    @PatchMapping("/{id}/status")
    public CommonResponseDTO<String> updateStatus(@PathVariable("id") String id, @RequestParam("status") String status) {
        memberService.modifyCmsMemberStatus(id, status);
        return CommonResponseDTO.success("회원 상태가 변경되었습니다.");
    }

    /** 회원 역할(권한) 부여 */
    @PostMapping("/{id}/roles")
    public CommonResponseDTO<String> saveRoles(@PathVariable("id") String id, @RequestBody List<String> roleCodes) {
        memberService.saveMemberRoles(id, roleCodes);
        return CommonResponseDTO.success("권한이 설정되었습니다.");
    }
}
