package com.nucms.cms.service;

import com.nucms.cms.model.CmsContentVO;

/**
 * CMS 워크플로우 서비스 인터페이스
 */
public interface CmsWorkflowService {

    /**
     * 콘텐츠 상태 변경 (워크플로우 단계 진행)
     * @param cntentsId 콘텐츠 ID
     * @param nextStatus 다음 상태 코드
     * @param procrId 처리기(승인자/작성자) ID
     * @param comment 처리 의견
     * @throws Exception
     */
    void changeStatus(String cntentsId, String nextStatus, String procrId, String comment) throws Exception;

    /**
     * 콘텐츠 승인 요청 (임시 -> 검토)
     */
    void requestApproval(String cntentsId, String procrId) throws Exception;

    /**
     * 콘텐츠 승인 (검토 -> 승인)
     */
    void approve(String cntentsId, String procrId, String comment) throws Exception;

    /**
     * 콘텐츠 반려 (검토 -> 임시)
     */
    void reject(String cntentsId, String procrId, String comment) throws Exception;
}
