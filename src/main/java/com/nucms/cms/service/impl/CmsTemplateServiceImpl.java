package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsTemplateMapper;
import com.nucms.cms.model.CmsTemplateVO;
import com.nucms.cms.service.CmsTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CMS 템플릿 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsTemplateServiceImpl implements CmsTemplateService {

    private final CmsTemplateMapper templateMapper;

    @Override
    public CmsTemplateVO getCmsTemplate(String tmplatId) {
        return templateMapper.selectCmsTemplate(tmplatId);
    }

    @Override
    public List<CmsTemplateVO> getCmsTemplateList(CmsTemplateVO vo) {
        return templateMapper.selectCmsTemplateList(vo);
    }

    @Override
    @Transactional
    public void registCmsTemplate(CmsTemplateVO vo) {
        templateMapper.insertCmsTemplate(vo);
    }

    @Override
    @Transactional
    public void updateCmsTemplate(CmsTemplateVO vo) {
        templateMapper.updateCmsTemplate(vo);
    }

    @Override
    @Transactional
    public void deleteCmsTemplate(String tmplatId) {
        templateMapper.deleteCmsTemplate(tmplatId);
    }
}
