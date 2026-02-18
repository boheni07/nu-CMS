package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 페이지뷰 통계 VO
 */
@Getter
@Setter
public class CmsStatsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 통계 ID */
    private Long statsId;

    /** 접속 URL */
    private String conectUrl;

    /** 접속자 고유 ID */
    private String esntlId;

    /** 접속 IP */
    private String conectIp;

    /** 이전 페이지 URL */
    private String refererUrl;

    /** 접속 일자 (YYYYMMDD) */
    private String conectDe;

    /** 기록 시점 */
    private LocalDateTime creatPnttm;

    /** 통계 가공용 필드 */
    private long statsCount;
    private String statsLabel;
}
