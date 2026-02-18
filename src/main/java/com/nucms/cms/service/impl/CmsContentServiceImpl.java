package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsContentMapper;
import com.nucms.cms.model.CmsContentVO;
import com.nucms.cms.service.CmsContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CMS 콘텐츠 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsContentServiceImpl implements CmsContentService {

    private final CmsContentMapper contentMapper;

    @Override
    public CmsContentVO getCmsContent(String cntentsId) {
        return contentMapper.selectCmsContent(cntentsId);
    }

    @Override
    public List<CmsContentVO> getCmsContentList(CmsContentVO vo) {
        return contentMapper.selectCmsContentList(vo);
    }

    @Override
    @Transactional
    public void registCmsContent(CmsContentVO vo) {
        // 초기 버전 번호 설정
        if(vo.getVerNo() == 0) {
            vo.setVerNo(1);
        }
        contentMapper.insertCmsContent(vo);
    }

    @Override
    @Transactional
    public void updateCmsContent(CmsContentVO vo) {
        // 1. 기존 데이터 조회
        CmsContentVO original = contentMapper.selectCmsContent(vo.getCntentsId());
        
        if (original != null) {
            // 2. 기존 데이터를 아카이빙 테이블로 이동
            contentMapper.insertCmsContentHist(original);
            
            // 3. 신규 버전 번호 부여
            vo.setVerNo(original.getVerNo() + 1);
            
            // 4. 원본 테이블 업데이트
            contentMapper.updateCmsContent(vo);
        }
    }

    @Override
    @Transactional
    public void deleteCmsContent(String cntentsId) {
        contentMapper.deleteCmsContent(cntentsId);
    }

    @Override
    @Transactional
    public void rollbackCmsContent(String cntentsId, Long histId) {
        java.util.Map<String, Object> param = new java.util.HashMap<>();
        param.put("cntentsId", cntentsId);
        param.put("histId", histId);
        contentMapper.rollbackCmsContent(param);
    }

    @Override
    public List<java.util.Map<String, Object>> getCmsContentHistList(String cntentsId) {
        return contentMapper.selectCmsContentHistList(cntentsId);
    }
}
