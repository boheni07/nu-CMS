package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

/**
 * CMS 레이아웃 설정 VO 클래스
 */
@Getter
@Setter
public class CmsLayoutConfigVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 설정 ID */
    private int configId;

    /** 템플릿 ID */
    private String tmplatId;

    /** 영역 명 (Header, Footer, Sidebar 등) */
    private String areaNm;

    /** 할당된 위젯 ID */
    private String widgetId;

    /** 영역 내 노출 순서 */
    private int expsrOrdr;

    /** 위젯 명 (조인용) */
    private String widgetNm;
}
