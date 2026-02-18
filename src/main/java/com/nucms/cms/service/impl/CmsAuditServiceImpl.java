package com.nucms.cms.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nucms.cms.mapper.CmsAuditLogMapper;
import com.nucms.cms.model.CmsAuditLogVO;
import com.nucms.cms.service.CmsAuditService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@Service
public class CmsAuditServiceImpl implements CmsAuditService {

    @Autowired
    private CmsAuditLogMapper auditMapper;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<CmsAuditLogVO> selectLogList(CmsAuditLogVO vo) throws Exception {
        return auditMapper.selectLogList(vo);
    }

    @Override
    public CmsAuditLogVO selectLog(CmsAuditLogVO vo) throws Exception {
        return auditMapper.selectLog(vo);
    }
    
    /**
     * 로그 저장
     * 실제 운영 환경에서는 @Async를 통해 비동기로 처리하여 메인 트랜잭션 성능에 영향을 주지 않도록 해야 함.
     */
    @Async
    @Override
    public void log(String actionTy, String menuId, String targetId, String targetNm, Object beforeVal, Object afterVal) {
        try {
            CmsAuditLogVO logVO = new CmsAuditLogVO();
            logVO.setActionTy(actionTy);
            logVO.setMenuId(menuId);
            logVO.setTargetId(targetId);
            logVO.setTargetNm(targetNm);
            
            if (beforeVal != null) {
                logVO.setBeforeVal(objectMapper.writeValueAsString(beforeVal));
            }
            if (afterVal != null) {
                logVO.setAfterVal(objectMapper.writeValueAsString(afterVal));
            }
            
            // 사용자 IP 및 ID 추출
            // 비동기 호출 시 RequestContextHolder 사용에 주의 필요 (메인 스레드와 컨텍스트 공유 안될 수 있음)
            // 여기서는 간단히 구현하거나, 호출 시점에 정보를 넘겨받아야 안전함.
            // 현재는 @Async가 동작하려면 별도 설정이 필요하므로 동기적으로 동작할 가능성이 큼.
            try {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();
                    logVO.setClientIp(request.getRemoteAddr());
                    // TODO: 세션에서 사용자 정보 추출
                    // HttpSession session = request.getSession();
                    // logVO.setUserId(...);
                }
            } catch (Exception e) {
                log.warn("Failed to get request attributes", e);
            }
            
            // 임시 사용자 정보 (로그인 구현 전까지 admin 고정)
            if (logVO.getUserId() == null) {
                logVO.setUserId("admin");
                logVO.setUserNm("관리자");
            }

            auditMapper.insertLog(logVO);
            
        } catch (Exception e) {
            log.error("Failed to insert audit log", e);
        }
    }
}
