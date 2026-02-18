package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

/**
 * CMS 메뉴 VO 클래스
 */
@Getter
@Setter
public class CmsMenuVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 메뉴 ID */
    private String menuId;
    
    /** 부모 메뉴 ID */
    private String upperMenuId;
    
    /** 메뉴명 */
    private String menuNm;

    /** 메뉴 레벨 */
    private int menuLvl;

    /** 메뉴 유형 코드 (LINK, CONT, WIDG) */
    private String menuTyCode;
    
    /** 연결 URL */
    private String conectUrl;
    
    /** 노출 순서 */
    private int expsrOrdr;
    
    /** 사용 여부 (Y/N) */
    private String useAt;

    /** 자식 메뉴 목록 (트리 구조용) */
    private java.util.List<CmsMenuVO> children;
}
