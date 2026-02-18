package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 템플릿 VO
 */
@Getter
@Setter
public class CmsTemplateVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String tmplatId;
    private String tmplatNm;
    private String tmplatSeCode;
    private String tmplatCours;
    private String useAt;
    private LocalDateTime frstRegistPnttm;
}
