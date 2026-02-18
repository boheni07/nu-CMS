package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsContentMapper;
import com.nucms.cms.mapper.CmsWorkflowLogMapper;
import com.nucms.cms.model.CmsContentVO;
import com.nucms.cms.service.CmsWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * CMS 워크플로우 서비스 구현 클래스
 */
@Service
@RequiredArgsConstructor
public class CmsWorkflowServiceImpl implements CmsWorkflowService {

    private final CmsContentMapper contentMapper;
    private final CmsWorkflowLogMapper workflowLogMapper;

    @Override
    @Transactional
    public void changeStatus(String cntentsId, String nextStatus, String procrId, String comment) throws Exception {
        CmsContentVO content = contentMapper.selectCmsContent(cntentsId);
        if (content == null) {
            throw new Exception("콘텐츠를 찾을 수 없습니다: " + cntentsId);
        }

        String preStatus = content.getSttusCode();
        
        // 상태 변경
        content.setSttusCode(nextStatus);
        contentMapper.updateCmsContent(content);

        // 로그 기록
        Map<String, Object> logParam = new HashMap<>();
        logParam.put("cntentsId", cntentsId);
        logParam.put("preStatusCode", preStatus);
        logParam.put("aftStatusCode", nextStatus);
        logParam.put("procrId", procrId);
        logParam.put("processCn", comment);
        workflowLogMapper.insertWorkflowLog(logParam);
    }

    @Override
    public void requestApproval(String cntentsId, String procrId) throws Exception {
        changeStatus(cntentsId, "R", procrId, "승인 요청");
    }

    @Override
    public void approve(String cntentsId, String procrId, String comment) throws Exception {
        // 승인 시 게시(P) 상태로 변경 (또는 별도 승인 상태 A 후 스케줄러가 P로 변경)
        // 여기서는 즉시 게시 가능한 상태인 'A'(승인)로 변경하거나 'P'(게시)로 변경
        changeStatus(cntentsId, "A", procrId, comment);
    }

    @Override
    public void reject(String cntentsId, String procrId, String comment) throws Exception {
        changeStatus(cntentsId, "I", procrId, "반려: " + comment);
    }
}
