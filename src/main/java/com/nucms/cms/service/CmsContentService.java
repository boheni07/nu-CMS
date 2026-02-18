package com.nucms.cms.service;

import com.nucms.cms.model.CmsContentVO;
import java.util.List;

/**
 * CMS 콘텐츠 관리 서비스 인터페이스
 */
public interface CmsContentService {

    /** 콘텐츠 상세 조회 */
    CmsContentVO getCmsContent(String cntentsId);

    /** 콘텐츠 목록 조회 */
    List<CmsContentVO> getCmsContentList(CmsContentVO vo);

    /** 콘텐츠 등록 */
    void registCmsContent(CmsContentVO vo);

    /** 콘텐츠 수정 (버전 관리 포함) */
    void updateCmsContent(CmsContentVO vo);

    /** 콘텐츠 삭제 */
    void deleteCmsContent(String cntentsId);

    /** 콘텐츠 특정 버전으로 롤백 */
    void rollbackCmsContent(String cntentsId, Long histId);

    /** 콘텐츠 변경 이력 목록 조회 */
    List<java.util.Map<String, Object>> getCmsContentHistList(String cntentsId);
}
