package com.nucms.cms.service;

import com.nucms.cms.model.CmsAuditLogVO;
import java.util.List;

public interface CmsAuditService {
    
    /**
     * 로그 목록 조회
     */
    List<CmsAuditLogVO> selectLogList(CmsAuditLogVO vo) throws Exception;
    
    /**
     * 로그 상세 조회
     */
    CmsAuditLogVO selectLog(CmsAuditLogVO vo) throws Exception;
    
    /**
     * 데이터 변경 로그 저장 (비동기 처리를 권장하지만, 현재는 동기 호출)
     * @param actionTy INSERT/UPDATE/DELETE
     * @param menuId 대상 메뉴 (예: BOARD, MEMBER)
     * @param targetId 대상 데이터 ID
     * @param targetNm 대상 데이터 명 (제목 등)
     * @param beforeVal 변경 전 데이터 (JSON)
     * @param afterVal 변경 후 데이터 (JSON)
     */
    void log(String actionTy, String menuId, String targetId, String targetNm, Object beforeVal, Object afterVal);
}
