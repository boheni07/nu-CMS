package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsWorkflowMapper;
import com.nucms.cms.model.CmsWorkflowHistoryVO;
import com.nucms.cms.model.CmsWorkflowRequestVO;
import com.nucms.cms.service.CmsWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CmsWorkflowServiceImpl implements CmsWorkflowService {

    private final CmsWorkflowMapper workflowMapper;

    @Override
    @Transactional
    public void requestApproval(CmsWorkflowRequestVO vo) {
        // ID 생성
        String reqId = "WFRQ_" + UUID.randomUUID().toString().substring(0, 15).toUpperCase();
        vo.setReqId(reqId);
        
        // 요청 등록
        workflowMapper.insertWorkflowRequest(vo);
        
        // 이력 기록 (REQUEST)
        CmsWorkflowHistoryVO hist = new CmsWorkflowHistoryVO();
        hist.setReqId(reqId);
        hist.setActionCode("REQUEST");
        hist.setActorId(vo.getReqUserId());
        hist.setActionMsg(vo.getReqCn());
        workflowMapper.insertWorkflowHistory(hist);
    }

    @Override
    @Transactional
    public void approveRequest(String reqId, String processUserId, String comment) {
        // 상태 업데이트
        CmsWorkflowRequestVO vo = new CmsWorkflowRequestVO();
        vo.setReqId(reqId);
        vo.setStatus("APPROVED");
        vo.setProcessUserId(processUserId);
        workflowMapper.updateWorkflowRequestStatus(vo);

        // 이력 기록 (APPROVE)
        CmsWorkflowHistoryVO hist = new CmsWorkflowHistoryVO();
        hist.setReqId(reqId);
        hist.setActionCode("APPROVE");
        hist.setActorId(processUserId);
        hist.setActionMsg(comment);
        workflowMapper.insertWorkflowHistory(hist);
        
        // TODO: 실제 데이터 반영 로직 (Callback or Event Publisher needed for full implementation)
    }

    @Override
    @Transactional
    public void rejectRequest(String reqId, String processUserId, String comment) {
        // 상태 업데이트
        CmsWorkflowRequestVO vo = new CmsWorkflowRequestVO();
        vo.setReqId(reqId);
        vo.setStatus("REJECTED");
        vo.setProcessUserId(processUserId);
        workflowMapper.updateWorkflowRequestStatus(vo);

        // 이력 기록 (REJECT)
        CmsWorkflowHistoryVO hist = new CmsWorkflowHistoryVO();
        hist.setReqId(reqId);
        hist.setActionCode("REJECT");
        hist.setActorId(processUserId);
        hist.setActionMsg(comment);
        workflowMapper.insertWorkflowHistory(hist);
    }

    @Override
    public List<CmsWorkflowRequestVO> getRequestList(CmsWorkflowRequestVO vo) {
        return workflowMapper.selectWorkflowRequestList(vo);
    }

    @Override
    public CmsWorkflowRequestVO getRequestDetail(String reqId) {
        return workflowMapper.selectWorkflowRequest(reqId);
    }

    @Override
    public List<CmsWorkflowHistoryVO> getHistoryList(String reqId) {
        return workflowMapper.selectWorkflowHistoryList(reqId);
    }
}
