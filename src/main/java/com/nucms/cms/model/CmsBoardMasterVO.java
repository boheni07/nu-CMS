package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 게시판 마스터 VO
 */
@Getter
@Setter
public class CmsBoardMasterVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 게시판 ID */
    private String bbsId;

    /** 게시판 명 */
    private String bbsNm;

    /** 게시판 소개 */
    private String bbsIntrcn;

    /** 게시판 유형 코드 */
    private String bbsTyCode;

    /** 답장 가능 여부 */
    private String replyPosblAt;

    /** 파일 첨부 가능 여부 */
    private String fileAtchPosblAt;

    /** 사용 여부 */
    private String useAt;

    /** 최초 등록 시점 */
    private LocalDateTime frstRegistPnttm;

    /** 최초 등록자 ID */
    private String frstRegisterId;
}
