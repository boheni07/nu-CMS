package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 파일 정보 VO (첨부파일 마스터 및 상세 통합)
 */
@Getter
@Setter
public class CmsFileVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 첨부파일 ID */
    private String atchFileId;

    /** 파일 순번 */
    private int fileSn;

    /** 파일 저장 경로 */
    private String fileStreCours;

    /** 저장 파일 명 */
    private String streFileNm;

    /** 원본 파일 명 */
    private String orignlFileNm;

    /** 파일 확장자 */
    private String fileExtsn;

    /** 파일 내용/설명 */
    private String fileCn;

    /** 파일 크기 */
    private long fileSize;

    /** 썸네일 여부 */
    private String thumbAt;

    /** 최초 등록 시점 */
    private LocalDateTime frstRegistPnttm;

    /** 사용 여부 (마스터용) */
    private String useAt;

    /** 삭제용 SN 리스트 */
    private int[] fileSns;

    /* DAM 확장 필드 */
    /** 이미지 너비 */
    private int fileWidth;
    /** 이미지 높이 */
    private int fileHeight;
    /** MIME 타입 */
    private String fileTy;
    /** 작성자/소유자 */
    private String author;
    /** 태그 (콤마 구분) */
    private String tags;
    /** 소속 폴더 ID */
    private String folderId;
}
