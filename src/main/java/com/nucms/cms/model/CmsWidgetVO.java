package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 위젯 VO 클래스
 */
@Getter
@Setter
public class CmsWidgetVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 위젯 ID */
    private String widgetId;

    /** 위젯 명 */
    private String widgetNm;

    /** 위젯 유형 코드 (BANNER, POPUP, QUICK) */
    private String widgetTyCode;

    /** 위젯 설정/콘텐츠 (JSON 형식 저장 가능) */
    private String widgetCn;

    /** 사용 여부 (Y/N) */
    private String useAt;

    /** 최초 등록 시점 */
    private LocalDateTime frstRegistPnttm;
}
