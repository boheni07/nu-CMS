package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsWorkflowHistoryVO;
import com.nucms.cms.model.CmsWorkflowRequestVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 워크플로우 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsWorkflowMapper {

    /* 워크플로우 요청 관리 */
    void insertWorkflowRequest(CmsWorkflowRequestVO vo);
    void updateWorkflowRequestStatus(CmsWorkflowRequestVO vo);
    List<CmsWorkflowRequestVO> selectWorkflowRequestList(CmsWorkflowRequestVO vo);
    CmsWorkflowRequestVO selectWorkflowRequest(String reqId);
    
    /* 워크플로우 이력 관리 */
    void insertWorkflowHistory(CmsWorkflowHistoryVO vo);
    List<CmsWorkflowHistoryVO> selectWorkflowHistoryList(String reqId);
}
