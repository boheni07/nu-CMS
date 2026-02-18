package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsContentVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * CMS 콘텐츠 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsContentMapper {

    /** 콘텐츠 상세 조회 */
    CmsContentVO selectCmsContent(String cntentsId);

    /** 콘텐츠 목록 조회 */
    List<CmsContentVO> selectCmsContentList(CmsContentVO vo);

    /** 콘텐츠 등록 */
    int insertCmsContent(CmsContentVO vo);

    /** 콘텐츠 수정 */
    int updateCmsContent(CmsContentVO vo);

    /** 콘텐츠 삭제 */
    int deleteCmsContent(String cntentsId);

    /** 콘텐츠 이력(아카이빙) 등록 */
    int insertCmsContentHist(CmsContentVO vo);

    /** 콘텐츠 특정 버전으로 롤백 */
    int rollbackCmsContent(java.util.Map<String, Object> param);

    /** 콘텐츠 변경 이력 목록 조회 */
    List<java.util.Map<String, Object>> selectCmsContentHistList(String cntentsId);
}
