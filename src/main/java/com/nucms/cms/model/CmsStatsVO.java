package com.nucms.cms.model;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
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

    /* 조회용 필드 */
    private String startDate; // 검색 시작일
    private String endDate;   // 검색 종료일
    private Long pvCount;     // PV 수
    private Long userCount;   // 방문자 수
}
