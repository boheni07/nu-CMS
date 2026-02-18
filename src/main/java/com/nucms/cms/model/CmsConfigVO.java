package com.nucms.cms.model;

import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@Data
public class CmsConfigVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 설정 ID */
    private String configId;
    
    /** 설정 키 */
    private String configKey;
    
    /** 설정 값 */
    private String configVal;
    
    /** 설정 설명 */
    private String configDc;
    
    /** 사용 여부 */
    private String useAt;
    
    /** 최초 등록 일시 */
    private Date frstRegistPnttm;
    
    /** 최초 등록자 ID */
    private String frstRegisterId;
    
    /** 최종 수정 일시 */
    private Date lastUpdtPnttm;
    
    /** 최종 수정자 ID */
    private String lastUpdusrId;
}
