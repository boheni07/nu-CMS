package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsMenuMapper;
import com.nucms.cms.model.CmsMenuVO;
import com.nucms.cms.service.CmsMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CMS 메뉴 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsMenuServiceImpl implements CmsMenuService {

    private final CmsMenuMapper menuMapper;

    @Override
    public CmsMenuVO getCmsMenu(String menuId) {
        return menuMapper.selectCmsMenu(menuId);
    }

    @Override
    public List<CmsMenuVO> getCmsMenuList(CmsMenuVO vo) {
        return menuMapper.selectCmsMenuList(vo);
    }

    @Override
    @Transactional
    public void registCmsMenu(CmsMenuVO vo) {
        // 상위 메뉴 ID가 빈 문자열("")인 경우 NULL로 처리 (외래키 제약조건 방지)
        if (vo.getUpperMenuId() != null && vo.getUpperMenuId().trim().isEmpty()) {
            vo.setUpperMenuId(null);
        }
        menuMapper.insertCmsMenu(vo);
    }

    @Override
    @Transactional
    public void updateCmsMenu(CmsMenuVO vo) {
        if (vo.getUpperMenuId() != null && vo.getUpperMenuId().trim().isEmpty()) {
            vo.setUpperMenuId(null);
        }
        menuMapper.updateCmsMenu(vo);
    }

    @Override
    @Transactional
    public void updateCmsMenuBatch(List<CmsMenuVO> menuList) {
        if (menuList != null) {
            for (CmsMenuVO vo : menuList) {
                if (vo.getUpperMenuId() != null && vo.getUpperMenuId().trim().isEmpty()) {
                    vo.setUpperMenuId(null);
                }
                menuMapper.updateCmsMenu(vo);
            }
        }
    }

    @Override
    @Transactional
    public void deleteCmsMenu(String menuId) {
        menuMapper.deleteCmsMenu(menuId);
    }
}
