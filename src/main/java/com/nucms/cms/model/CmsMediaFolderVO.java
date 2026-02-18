package com.nucms.cms.model;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 미디어 폴더 VO
 */
@Data
public class CmsMediaFolderVO implements Serializable {
    
    private static final long serialVersionUID = 1L;

    /** 폴더 ID */
    private String folderId;
    
    /** 상위 폴더 ID */
    private String upperFolderId;
    
    /** 폴더 명 */
    private String folderNm;
    
    /** 사용 여부 */
    private String useAt;
    
    /** 생성 일시 */
    private LocalDateTime frstRegistPnttm;
    
    // 계층형 구조 표현을 위한 필드 (필요시)
    private int level;
}
