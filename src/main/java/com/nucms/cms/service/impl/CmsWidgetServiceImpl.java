package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsWidgetMapper;
import com.nucms.cms.model.CmsWidgetVO;
import com.nucms.cms.service.CmsWidgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * CMS 위젯 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsWidgetServiceImpl implements CmsWidgetService {

    private final CmsWidgetMapper widgetMapper;

    @Override
    public CmsWidgetVO getCmsWidget(String widgetId) {
        return widgetMapper.selectCmsWidget(widgetId);
    }

    @Override
    public List<CmsWidgetVO> getCmsWidgetList(CmsWidgetVO vo) {
        return widgetMapper.selectCmsWidgetList(vo);
    }

    @Override
    @Transactional
    public void registCmsWidget(CmsWidgetVO vo) {
        if (vo.getWidgetId() == null || vo.getWidgetId().isEmpty()) {
            vo.setWidgetId("WIDGET_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (vo.getUseAt() == null || vo.getUseAt().isEmpty()) {
            vo.setUseAt("Y");
        }
        widgetMapper.insertCmsWidget(vo);
    }

    @Override
    @Transactional
    public void modifyCmsWidget(CmsWidgetVO vo) {
        widgetMapper.updateCmsWidget(vo);
    }

    @Override
    @Transactional
    public void removeCmsWidget(String widgetId) {
        widgetMapper.deleteCmsWidget(widgetId);
    }
}
