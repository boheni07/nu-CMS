package com.nucms.cms.service;

import com.nucms.cms.model.CmsWorkflowHistoryVO;
import com.nucms.cms.model.CmsWorkflowRequestVO;

import java.util.List;

/**
 * 워크플로우 관리 서비스 인터페이스
 */
public interface CmsWorkflowService {

    /** 워크플로우 승인 요청 */
    void requestApproval(CmsWorkflowRequestVO vo);

    /** 워크플로우 승인 처리 */
    void approveRequest(String reqId, String processUserId, String comment);

    /** 워크플로우 반려 처리 */
    void rejectRequest(String reqId, String processUserId, String comment);

    /** 워크플로우 요청 목록 조회 */
    List<CmsWorkflowRequestVO> getRequestList(CmsWorkflowRequestVO vo);

    /** 워크플로우 요청 상세 조회 */
    CmsWorkflowRequestVO getRequestDetail(String reqId);

    /** 워크플로우 이력 목록 조회 */
    List<CmsWorkflowHistoryVO> getHistoryList(String reqId);
}
