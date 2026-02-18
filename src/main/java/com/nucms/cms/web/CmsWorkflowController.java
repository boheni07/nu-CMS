package com.nucms.cms.web;

import com.nucms.cms.model.CmsWorkflowHistoryVO;
import com.nucms.cms.model.CmsWorkflowRequestVO;
import com.nucms.cms.service.CmsWorkflowService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cms/workflow")
@RequiredArgsConstructor
public class CmsWorkflowController {

    private final CmsWorkflowService workflowService;

    /**
     * 워크플로우 승인 요청
     */
    @PostMapping("/request")
    public CommonResponseDTO<String> requestApproval(@RequestBody CmsWorkflowRequestVO vo) {
        // 현재 로그인한 사용자 ID 설정 (SecurityContextHolder 이용)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            vo.setReqUserId(auth.getName()); // username (ID)
        }
        
        workflowService.requestApproval(vo);
        return CommonResponseDTO.success("승인 요청이 등록되었습니다.");
    }

    /**
     * 워크플로우 승인 처리
     */
    @PostMapping("/{reqId}/approve")
    public CommonResponseDTO<String> approveRequest(
            @PathVariable("reqId") String reqId,
            @RequestBody CmsWorkflowHistoryVO body) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String processUserId = (auth != null) ? auth.getName() : "SYSTEM";
        
        workflowService.approveRequest(reqId, processUserId, body.getActionMsg());
        return CommonResponseDTO.success("승인 처리되었습니다.");
    }

    /**
     * 워크플로우 반려 처리
     */
    @PostMapping("/{reqId}/reject")
    public CommonResponseDTO<String> rejectRequest(
            @PathVariable("reqId") String reqId,
            @RequestBody CmsWorkflowHistoryVO body) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String processUserId = (auth != null) ? auth.getName() : "SYSTEM";
        
        workflowService.rejectRequest(reqId, processUserId, body.getActionMsg());
        return CommonResponseDTO.success("반려 처리되었습니다.");
    }

    /**
     * 워크플로우 요청 목록 조회
     */
    @GetMapping("/request")
    public CommonResponseDTO<List<CmsWorkflowRequestVO>> getRequestList(CmsWorkflowRequestVO vo) {
        return CommonResponseDTO.success(workflowService.getRequestList(vo));
    }

    /**
     * 워크플로우 요청 상세 조회
     */
    @GetMapping("/request/{reqId}")
    public CommonResponseDTO<CmsWorkflowRequestVO> getRequestDetail(@PathVariable("reqId") String reqId) {
        return CommonResponseDTO.success(workflowService.getRequestDetail(reqId));
    }

    /**
     * 워크플로우 이력 조회
     */
    @GetMapping("/request/{reqId}/history")
    public CommonResponseDTO<List<CmsWorkflowHistoryVO>> getHistoryList(@PathVariable("reqId") String reqId) {
        return CommonResponseDTO.success(workflowService.getHistoryList(reqId));
    }
}
