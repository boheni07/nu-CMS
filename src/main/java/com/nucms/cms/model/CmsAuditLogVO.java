package com.nucms.cms.model;

import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@Data
public class CmsAuditLogVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 로그 ID */
    private int logId;
    
    /** 행위 유형 (INSERT, UPDATE, DELETE) */
    private String actionTy;
    
    /** 대상 메뉴 ID */
    private String menuId;
    
    /** 대상 데이터 ID */
    private String targetId;
    
    /** 대상 데이터 명 */
    private String targetNm;
    
    /** 변경 전 데이터 (JSON) */
    private String beforeVal;
    
    /** 변경 후 데이터 (JSON) */
    private String afterVal;
    
    /** 요청 IP */
    private String clientIp;
    
    /** 수행자 ID */
    private String userId;
    
    /** 수행자 명 */
    private String userNm;
    
    /** 발생 일시 */
    private Date creatDt;
    
    // 검색용 필드
    private String searchKeyword;
    private String searchDateStart;
    private String searchDateEnd;
}
