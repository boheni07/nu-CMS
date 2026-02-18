package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsAccessLogMapper;
import com.nucms.cms.model.CmsAccessLogVO;
import com.nucms.cms.service.CmsAccessLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CMS 접속 및 감사 로그 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsAccessLogServiceImpl implements CmsAccessLogService {

    private final CmsAccessLogMapper accessLogMapper;

    @Override
    public List<CmsAccessLogVO> getAccessLogList(CmsAccessLogVO vo) {
        return accessLogMapper.selectAccessLogList(vo);
    }

    @Override
    @Transactional
    public void registAccessLog(CmsAccessLogVO vo) {
        accessLogMapper.insertAccessLog(vo);
    }
}
