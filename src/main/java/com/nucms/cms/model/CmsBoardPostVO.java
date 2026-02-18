package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 게시판 게시물 VO
 */
@Getter
@Setter
public class CmsBoardPostVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 게시물 ID */
    private Long nttId;

    /** 게시판 ID */
    private String bbsId;

    /** 게시물 제목 */
    private String nttSj;

    /** 게시물 내용 */
    private String nttCn;

    /** 조회수 */
    private int rdcnt;

    /** 사용 여부 */
    private String useAt;

    /** 첨부파일 ID */
    private String atchFileId;

    /** 최초 등록자 ID */
    private String frstRegisterId;

    /** 최초 등록자 이름 (Join용) */
    private String frstRegisterNm;

    /** 최초 등록 시점 */
    private LocalDateTime frstRegistPnttm;

    /** 검색용 필드 */
    private String searchKeyword;
    private String searchCondition;
}
