package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 접속 및 감사 로그 VO 클래스
 */
@Getter
@Setter
public class CmsAccessLogVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 로그 ID */
    private Long logId;

    /** 수행자 고유 ID */
    private String esntlId;

    /** 접속 IP */
    private String conectIp;

    /** HTTP 메소드 */
    private String conectMethod;

    /** 접속 URL */
    private String conectUrl;

    /** 로그 상세(파라미터 등) */
    private String logCn;

    /** 발생 시점 */
    private LocalDateTime creatPnttm;

    /** 수행자 명 (조인용) */
    private String mberNm;
}
