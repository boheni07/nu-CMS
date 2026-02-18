package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 역할 VO 클래스
 */
@Getter
@Setter
public class CmsRoleVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 역할 코드 */
    private String roleCode;

    /** 역할 명 */
    private String roleNm;

    /** 역할 설명 */
    private String roleDc;

    /** 사용 여부 */
    private String useAt;

    /** 최초 등록 시점 */
    private LocalDateTime frstRegistPnttm;
}
