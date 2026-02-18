package com.nucms.cms.model;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 워크플로우 요청 VO
 */
@Data
public class CmsWorkflowRequestVO implements Serializable {
    
    private static final long serialVersionUID = 1L;

    /** 요청 ID (WFRQ_...) */
    private String reqId;
    
    /** 대상 콘텐츠 ID */
    private String targetId;
    
    /** 대상 유형 (ARTICLE, MENU, WIDGET) */
    private String targetType;
    
    /** 요청자 ID */
    private String reqUserId;
    
    /** 요청자 명 (조회용) */
    private String reqUserNm;
    
    /** 요청 일시 */
    private LocalDateTime reqDt;
    
    /** 요청 제목 */
    private String reqSj;
    
    /** 요청 내용 */
    private String reqCn;
    
    /** 상태 (REQUESTED, APPROVED, REJECTED, CANCELLED) */
    private String status;
    
    /** 처리자 ID */
    private String processUserId;
    
    /** 처리자 명 (조회용) */
    private String processUserNm;
    
    /** 처리 일시 */
    private LocalDateTime processDt;
    
    /** 데이터 스냅샷 (JSON) */
    private String dataSnapshot;
    
    // 검색 조건
    private String searchKeyword;
    private String searchCondition;
}
