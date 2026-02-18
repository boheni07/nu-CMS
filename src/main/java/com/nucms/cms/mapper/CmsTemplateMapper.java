package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsTemplateVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * CMS 템플릿 Mapper 인터페이스
 */
@Mapper
public interface CmsTemplateMapper {
    CmsTemplateVO selectCmsTemplate(String tmplatId);
    List<CmsTemplateVO> selectCmsTemplateList(CmsTemplateVO vo);
    int insertCmsTemplate(CmsTemplateVO vo);
    int updateCmsTemplate(CmsTemplateVO vo);
    int deleteCmsTemplate(String tmplatId);
}
