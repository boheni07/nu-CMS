package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 콘텐츠 VO 클래스
 */
@Getter
@Setter
public class CmsContentVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 콘텐츠 ID */
    private String cntentsId;
    
    /** 제목 */
    private String sj;
    
    /** 본문 */
    private String cn;
    
    /** 작성자 ID */
    private String wrterId;
    
    /** 상태 코드 (I:임시, R:검토, A:승인, P:게시, D:종료) */
    private String sttusCode;
    
    /** 버전 번호 */
    private int verNo;

    /** 적용 템플릿 ID */
    private String tmplatId;

    /** 카테고리 ID */
    private String ctgryId;

    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime ntceBgnde;

    /** 게시 종료 일시 */
    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime ntceEndde;
    
    /** 최초 등록 시점 */
    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime frstRegistPnttm;
    
    /** 최종 수정 시점 */
    private LocalDateTime lastUpdtPnttm;
}
