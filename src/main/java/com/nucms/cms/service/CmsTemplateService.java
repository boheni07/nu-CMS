package com.nucms.cms.service;

import com.nucms.cms.model.CmsTemplateVO;
import java.util.List;

/**
 * CMS 템플릿 서비스 인터페이스
 */
public interface CmsTemplateService {
    CmsTemplateVO getCmsTemplate(String tmplatId);
    List<CmsTemplateVO> getCmsTemplateList(CmsTemplateVO vo);
    void registCmsTemplate(CmsTemplateVO vo);
    void updateCmsTemplate(CmsTemplateVO vo);
    void deleteCmsTemplate(String tmplatId);
}
