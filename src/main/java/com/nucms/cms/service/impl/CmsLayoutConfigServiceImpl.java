package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsLayoutConfigMapper;
import com.nucms.cms.model.CmsLayoutConfigVO;
import com.nucms.cms.service.CmsLayoutConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CMS 레이아웃 설정 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsLayoutConfigServiceImpl implements CmsLayoutConfigService {

    private final CmsLayoutConfigMapper layoutConfigMapper;

    @Override
    public List<CmsLayoutConfigVO> getLayoutConfigList(String tmplatId) {
        return layoutConfigMapper.selectLayoutConfigList(tmplatId);
    }

    @Override
    @Transactional
    public void saveLayoutConfig(String tmplatId, List<CmsLayoutConfigVO> configList) throws Exception {
        // 기존 설정 전체 삭제
        layoutConfigMapper.deleteLayoutConfigByTmplat(tmplatId);
        
        // 신규 설정 일괄 등록
        for (CmsLayoutConfigVO config : configList) {
            config.setTmplatId(tmplatId);
            layoutConfigMapper.insertLayoutConfig(config);
        }
    }
}
