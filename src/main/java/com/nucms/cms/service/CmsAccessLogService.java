package com.nucms.cms.service;

import com.nucms.cms.model.CmsAccessLogVO;
import java.util.List;

/**
 * CMS 접속 및 감사 로그 서비스 인터페이스
 */
public interface CmsAccessLogService {

    /** 감사 로그 목록 조회 */
    List<CmsAccessLogVO> getAccessLogList(CmsAccessLogVO vo);

    /** 감사 로그 등록 */
    void registAccessLog(CmsAccessLogVO vo);
}
