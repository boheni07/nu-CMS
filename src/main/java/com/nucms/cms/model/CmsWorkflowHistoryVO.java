package com.nucms.cms.model;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 워크플로우 이력 VO
 */
@Data
public class CmsWorkflowHistoryVO implements Serializable {
    
    private static final long serialVersionUID = 1L;

    /** 이력 ID (Auto Increment) */
    private Long histId;
    
    /** 요청 ID */
    private String reqId;
    
    /** 행동 코드 (REQUEST, APPROVE, REJECT) */
    private String actionCode;
    
    /** 행위자 ID */
    private String actorId;
    
    /** 행위자 명 (조회용) */
    private String actorNm;
    
    /** 행위 일시 */
    private LocalDateTime actionDt;
    
    /** 행위 메시지 (반려 사유 등) */
    private String actionMsg;
}
